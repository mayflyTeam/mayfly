import express from 'express'

import nc from './NATS.js'

const app = express();

app.get('/', (req, res) => {
  // Get message from request body
  const message = JSON.stringify({
    cluster: "plane.test",
    max_idle_secs: 30,
    metadata: {},
    executable: {
        image: "ghcr.io/drifting-in-space/demo-image-drop-four",
        env: {},
    }
  })

  // Publish to NATS
  nc.publish('cluster.plane_test.schedule', message);

  res.send('Published message');
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Port running on', 3001);
});