import express, { Request, Response } from 'express'
import pgPromise from 'pg-promise'
import axios from 'axios'

import { 
  getAllServicesByUser, 
  getServiceId, 
  getConvertedBackends,
  insertIntoBackend,
  insertIntoUserBackends
 } from '../services/mayflyServices'

const router = express.Router()
const pgp = pgPromise();
const cn = 'postgres://mayfly:mayfly@localhost:5432/mayfly'
const db = pgp(cn);

interface Service {
  id: number;
  name: string;
}

interface Backend {
  id: number,
  url: string;
  launch_success: boolean;
  created_at: Date;
  terminated_at: Date;
}

interface HatchResponse {
  url: string | null;
  error: string | null;
}

//opportunity for caching

router.get("/:user/services", 
  (req: Request<{user: string}>, res: Response<Array<Service>>) => {
    const userId: number = Number(req.params.user);
    getAllServicesByUser(userId)
      .then((services: Service[]) => {
        res.send(services);
      })
});

router.get('/:user/services/:service', 
  (req: Request<{user: string, service: string}>, res: Response<Array<{url: string, launchSuccess: boolean, hatchedAt: Date, squishedAt: Date}> | string>) => {
    const user = req.params.user;
    const service = req.params.service;
    getServiceId(service)
      .then(serviceId => {
        return getConvertedBackends(user, serviceId);
      })
      .then(convertedBackends => {
        res.send(convertedBackends);
      })
      .catch(error => {
        console.log('Error:', error);
        res.status(500).send('Internal server error');
      });
});

router.get('/:user/services/:service/hatch', (req: Request, res: Response) => {
  //1 send a hatch request to Nate's EC2
  //2 update the database
  //cache the name = service_id relationship, user; cache in session

  const serviceToImage: Record<string, string> = {
    "drop4": "ghcr.io/drifting-in-space/demo-image-drop-four:latest",
    "jupyter-notebook": 'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787'
  }
  
  const planeIP: string = '34.237.126.241'
  const port: string = '3001'
  const image:string = serviceToImage[req.params.service]
  const userId: number = Number(req.params.user);
  const serviceName: string = req.params.service

  const address: string = `http://${planeIP}:${port}/?image=${image}`
  // const address: string = 'http://localhost:3000/testPlane'

  axios.get<HatchResponse>(address)
    .then((response) => {
      const data = response.data
      getServiceId(serviceName)
        .then(serviceId => {
          const success: boolean = data.error === null ? true : false;
          insertIntoBackend(data.url, success, serviceId)
            .then(newBackend => {
              console.log("userId", userId, "newBackend", newBackend)
              insertIntoUserBackends(userId, newBackend.id)
                .then(result => console.log(result))
                .catch(e => console.log("noneError", e));
            })
            .catch(err => console.log('insert backend error:', err));
      
          res.json(data);
        })
        .catch(e => {
          console.log("query name to id error")
        })

    })
    .catch(error => {
      console.log(error);
    })
})


router.get("/testPlane", (req: Request, res: Response) => {
  const roll: number = Math.random()
  const url: number = Math.floor(Math.random() * 1000)
  setTimeout(() => {
    if (roll < .5) {
      res.json({url: `www.workingBackend.com/${url}`, error: null})
    } else {
      res.json({url: null, error: "Plane error"})
    }
  }, 1200)
  
})

router.get("/testNametoId", (req: Request, res: Response) => {
  db.one<Service>('SELECT id FROM services WHERE name = $1', ["drop4"])
  .then(response => console.log(response))
})

router.post("/addService", (req: Request, res: Response) => {
  //security
  //post route with json object
  //req.name - string; req.image - string
  //sent as a post to Nate
  const data: Object = req.body

  axios.post("/testAddService", data)
    .then(response => {

      res.send(response.status)
    })
    .catch(error => {
      console.log('nate add service error')
    })
})


router.post('testAddService', (req: Request, res: Response) => {

})

export { router };