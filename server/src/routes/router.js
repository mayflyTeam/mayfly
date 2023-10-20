import express from 'express'
import { getUrl } from '../services/backendSpinUp.js'
import { getUrlFromNats } from '../services/natsSpinUp.js'
import pgPromise from 'pg-promise'
import { insertBackendSuccess, insertBackendFailure } from '../services/backendLaunchSQL.js'
import { 
  addFakeServiceTest, 
  retrieveAllServicesTest,
  retrieveBackendsByService
} from '../services/testSQL.js'

const router = express.Router();

router.get('/nats', async (req, res) => {
  const response = await getUrlFromNats();
  res.send(response);
  // const message = JSON.stringify({
  //   cluster: "plane.test",
  //   max_idle_secs: 30,
  //   metadata: {},
  //   executable: {
  //       image: "ghcr.io/drifting-in-space/demo-image-drop-four",
  //       env: {},
  //   }
  // });

  // // Publish to NATS
  // nc.publish('cluster.plane_test.schedule', message);

  // res.send('Published message');
})

router.get("/services/:service", async (req, res) => {
  const service = req.params.service
  const data = await getUrl(service)

  if (data.error === "error from Plane drone") {
    console.log('error from drone')
    await insertBackendFailure()
    res.send(data.error + "please try again")
  } else {
    console.log("data:", `url is ${data.url}, backendId is ${data.backendId}`)
    await insertBackendSuccess(data)
    res.send(data.url)
  }
})

router.get("/service/:service_id/backends", async (req, res) => {
  const serviceId = req.params.service_id
  try {
    const backends = await retrieveBackendsByService(serviceId)
    res.send(backends)
  } catch(e) {
    console.log("/service/:service_id/backends error")
  }
  
})

router.get("/db/testDBInsert", async (req, res) => {
  addFakeServiceTest()
  res.sendStatus(200)
})

router.get("/db/testDBRetrieve", async (req, res) => {
  try {
    const data = await retrieveAllServicesTest()
    res.send(data)
  } catch(e) {
    console.log("/db/testDBRetrieve error")
  }

});

export default router