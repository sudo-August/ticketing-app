import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  
  try {
    await publisher.publish({
      id: randomBytes(4).toString('hex'),
      title: 'concert',
      price: 20
    });
  } catch (err) {
    console.log(err);
  }
});