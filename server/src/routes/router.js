import express from 'express'
import { getUrl } from '../services/backendSpinUp.js'

const router = express.Router();

router.get("/services/:service", async (req, res) => {
  const service = req.params.service
  //in future prototypes this would make a call to a DB to find 
  //the address @ of the container in the registry
  const data = await getUrl(service)
  if (data === "error from Plane drone") {
    console.log('error from drone')
    res.send(data + " please try again")
  } else {
    console.log("data:", `url is ${data}`)
    res.send(data)
  }
})

export default router