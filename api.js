import express from 'express'

import nc from './NATS.js'

const app = express();

app.get('/', async (req, res) => {
  // Get message from request body
  const message = JSON.stringify({
    cluster: "plane.test",
    max_idle_secs: 60,
    metadata: {},
    executable: {
        image: "ghcr.io/drifting-in-space/demo-image-drop-four",
        env: {},
    }
  })

  // Publish to NATS
  const reply = await nc.request('cluster.plane_test.schedule', message, {max:1});

  const responseData = JSON.parse(reply.data);

  console.log('Received NATS response:', responseData);

  const url = `http://localhost:8080/_plane_backend=${responseData.Scheduled.backend_id}/`

  res.send(url);
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Port running on', 3001);
});