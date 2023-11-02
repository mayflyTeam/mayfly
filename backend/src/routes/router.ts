import express, { Request, Response } from 'express'
import pgPromise from 'pg-promise'
import axios from 'axios'
import { Interface } from 'readline';

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
  (req: Request<{user: string}>, res: Response<Array<{id: number, name: string}>>) => {
    const userId: string = req.params.user;
    db.many<Service>('SELECT id, name FROM services WHERE user_id = $1', userId)
      .then(services => {
        res.send(services)
      })
      .catch(error => {
        console.log(error);
      });
});

router.get('/:user/services/:service', 
  (req: Request<{user: string, service: string}>, res: Response<Array<{url: string, launchSuccess: boolean, hatchedAt: Date, squishedAt: Date}>>) => {
    const user = req.params.user;
    const service = req.params.service;
    db.one<Service>('SELECT id FROM services WHERE name = $1', [service])
      .then (response => {
        db.many<Backend>('SELECT url, launch_success, created_at, terminated_at FROM backends AS b JOIN users_backends AS ub ON b.id = ub.backend_id WHERE ub.user_id = $1 AND b.service_id = $2 ORDER BY b.created_at DESC', [user, response.id])
        .then(backends => {
          const convertedBackends = backends.map(backend => {
            return {
              url: backend.url,
              launchSuccess: backend.launch_success,
              hatchedAt: backend.created_at,
              squishedAt: backend.terminated_at
            }
          });

          res.send(convertedBackends);
          })
        .catch(error => console.log('Error on 2nd call', error))
      })
      .catch(error => console.log('Error on 1st call', error));
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
      db.one<Service>('SELECT id FROM services WHERE name = $1', [serviceName])
        .then(serviceResponse => {
          const service_id: number = Number(serviceResponse.id)
          const success: boolean = data.error === null ? true : false;
          const url:string = data.url === null ? "launch failure" :  data.url;
          const info: Object = {url: url, launchSuccess: success, service_id: service_id, error: data.error};
          console.log('url', url, 'launch_success', success, 'service_id', service_id)
          db.one<Backend>("INSERT INTO backends (url, launch_success, service_id) VALUES ($1, $2, $3) RETURNING *", [url, success, service_id])
            .then(newBackend => {
              console.log("userId", userId, "newBackend", newBackend)
              db.none('INSERT INTO users_backends (user_id, backend_id) VALUES ($1, $2)', [userId, newBackend.id])
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