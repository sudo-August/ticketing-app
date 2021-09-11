import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent,  } from '@planet-express/common';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = 'orders-service'; // replace with import { QueueGroup } from '@planet-express/common'

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('ticket not found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    
    try {
      await ticket.save();
    } catch {
      console.log('error saving update')
    }

    msg.ack();
  }
}