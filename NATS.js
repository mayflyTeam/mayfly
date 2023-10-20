// Require the NATS client library
import nats from 'nats';

// Connect to the NATS server
const nc = await nats.connect({
  servers: 'nats://nats:4222', // Use the service name 'nats' defined in your Docker Compose file
});

nc.subscribe("cluster.*.schedule", {
  callback: (err, msg) => {
    console.log(err, msg)
  }
})

console.log('hello world')

const message = {
  cluster: "plane.test",
  max_idle_secs: 30,
  metadata: {},
  executable: {
      image: "ghcr.io/drifting-in-space/demo-image-drop-four",
      env: {},
  }
}

nc.publish('cluster.plane_test.schedule', message);

export default nc