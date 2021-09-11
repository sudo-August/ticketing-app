import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@planet-express/common';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'orders-service'; // replace with import { QueueGroup } from '@planet-express/common'

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price
    });
    try {
      await ticket.save();
    } catch {
      console.log('error saving ticket');
    }

    msg.ack();
  }
}