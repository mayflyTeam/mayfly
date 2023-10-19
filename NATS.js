// Require the NATS client library
import nats from 'nats';

// Connect to the NATS server
const nc = await nats.connect({url: 'nats://127.0.0.1:4222:4222'});

nc.subscribe("cluster.*.schedule", {
  callback: (err, msg) => {
    console.log(err, msg)
  }
})

export default nc