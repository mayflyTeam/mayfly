import express from 'express'

import nc from './NATS.js'

const app = express();

app.get('/', (req, res) => {
  // Get message from request body
  const message = {
    cluster: "plane.test",   // Name of cluster to spawn on (should match the cluster of the drone you started.)
    max_idle_secs: 30,      // How long a process can have no connections before Plane shuts it down.
    metadata: {},           // Arbitrary key/value pairs to associate with this process, currently used only for logging.
    executable: {           // Specification of the process you want to run.
        image: "ghcr.io/drifting-in-space/demo-image-drop-four", // The OCI/Docker image you want to run.
        env: {},            // Environment variables to pass to the process.
    }
  }

  // Publish to NATS
  nc.publish('cluster.plane_test.schedule', message);

  res.send('Published message');
});

app.listen(3001, () => {
  console.log('Port running on', 3001);
});