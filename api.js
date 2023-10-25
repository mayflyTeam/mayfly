import express from 'express'

import nc from './NATS.js'

const app = express();

app.get('/', async (req, res) => {
  // Get message from request body
  const message = JSON.stringify({
    cluster: "taishan.website",
    max_idle_secs: 60,
    metadata: {},
    executable: {
        image: "ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787",
        env: {},
    }
  })

  // Publish to NATS
  const reply = await nc.request('cluster.taishan_website.schedule', message, {max:1});

  const responseData = JSON.parse(reply.data);

  console.log('Received NATS response:', responseData);

  const url = `http://${responseData.Scheduled.backend_id}.taishan.website:8080/`

  res.send(url);
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Port running on', 3001);
});