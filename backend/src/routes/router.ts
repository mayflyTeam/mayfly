import express, { Request, Response } from 'express'
import pgPromise from 'pg-promise'
import axios from 'axios'

import { 
  getAllServicesByUser, 
  getServiceId, 
  getConvertedBackends,
  insertIntoServices,
  insertIntoBackends,
  insertIntoUserBackends
 } from '../services/mayflyServices'
import { spawn, squish } from '../services/nats-commands'

const router = express.Router();
router.use(express.json());
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

router.post("/addService", (req: Request, res: Response) => {
  //security
  //post route with json object
  //req.name - string; req.image - string
  //sent as a post to Nate
  console.log('body:', req.body)
  const serviceName: string = req.body.serviceName
  const image: string = req.body.image
  const userId: number = req.body.userId
  console.log('name:', serviceName, 'image:', image, 'user:', userId)
  insertIntoServices(serviceName, image, userId)
  res.sendStatus(200);
})

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

router.get('/:user/services/:service/hatch', async (req: Request, res: Response) => {
  console.log('whats up')
  const serviceToImage: Record<string, string> = {
    "drop4": "ghcr.io/drifting-in-space/demo-image-drop-four:latest",
    "jupyter-notebook": 'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787',
    "whiteboard": 'rofl256/whiteboard'
  }
  const serviceName: string = req.params.service
  const userId: number = Number(req.params.user);
  const image: string = serviceToImage[serviceName]

  const data: HatchResponse = await spawn(image)

  try {
    const serviceId: number = await getServiceId(serviceName)
    const newBackend: Backend = await insertIntoBackends(data.url, true, serviceId)
    console.log(await insertIntoUserBackends(userId, newBackend.id))
    res.json(data)
  } catch(e) {
    console.error("An error occurred:", e);
    res.status(500).send("An error occurred while processing your request.");
  }
})


router.get("/testUrl", (req: Request, res: Response) => {
  const roll: number = Math.random()
  //const url: number = Math.floor(Math.random() * 1000)
  if (roll < .5) {
    res.json({url: `http://localhost:5173/home`, error: null})
  } else {
    res.json({url: `http://localhost:5173/services`, error: null})
  }
  
})

router.get("/testNametoId", (req: Request, res: Response) => {
  db.one<Service>('SELECT id FROM services WHERE name = $1', ["drop4"])
  .then(response => console.log(response))
})


router.get("/testDemoLaunch/:name", async (req: Request, res: Response) => {
  const services: Record<string, string> = {
    "Drop4": "ghcr.io/drifting-in-space/demo-image-drop-four:latest",
    "jupyter-notebook": 'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787',
    "whiteboard": "rofl256/whiteboard"
  }
  const service = req.params.name
  const planeIP: string = 'mayfly.website'
  const port: string = '3001'
  const image:string = services[service]

  const address: string = `http://${planeIP}:${port}/?image=${image}`
  // const address = 'http://localhost:3000/testPlane'

  axios.get(address)
  .then((response) => {
    const data = response.data
    const url = data.url
    res.json({url})
  })
})

router.post("/fetchDemoUrl", async (req:Request, res:Response) => {
  const url = req.params['url']
  res.send(url)
})

export { router };