import express from 'express'
import nc from './NATS.js'

const app = express();

app.get('/', async (req, res) => {
  let image = req.query.image
  if (!image) {
    image = "ittennull/checkers"
  }
  
  // Get message from request body
  const message = JSON.stringify({
    cluster: "taishan.website",
    max_idle_secs: 120,
    metadata: {},
    executable: {
        image: image,
        env: {},
    }
  })
  
  let responseData, url
  
  try {
    const reply = await nc.request('cluster.taishan_website.schedule', message, {max:1});
    responseData = JSON.parse(reply.data);
    url = `http://${responseData.Scheduled.backend_id}.taishan.website:8080/`
    res.send({'url': url, 'error': null});
  } catch(e) {
    res.send({'url': url, 'error': responseData})
  }
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Port running on', 3001);
});