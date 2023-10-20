// Require the NATS client library
import nats from 'nats';

// Connect to the NATS server
const nc = await nats.connect({
  servers: 'nats://nats:4222', // Use the service name 'nats' defined in your Docker Compose file
});

nc.subscribe("cluster.*.schedule", {
  callback: (err, msg) => {
    console.log('Error: ', err)
    console.log('Message: ', msg)
  }
})

export default nc