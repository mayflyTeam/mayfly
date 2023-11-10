import { connect, NatsConnection } from 'nats';

async function connectNats(): Promise<NatsConnection> {
  try {
    const nc = await connect({
      servers: 'http://localhost:4222',
    });
    console.log('Connected to NATS');
    return nc;
  } catch (error) {
    console.error('Failed to connect to NATS', error);
    throw error;
  }
}

export default connectNats;
