// Require the NATS client library
import nats from 'nats';

// Connect to the NATS server
const nc = await nats.connect({
  servers: 'http://localhost:4222', // Use the service name 'nats' defined in your Docker Compose file
});


export default nc