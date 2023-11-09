import nats from 'nats';
const nc = await nats.connect({
  servers: 'http://54.227.91.249:4222',
});

export default nc