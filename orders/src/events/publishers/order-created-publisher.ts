import { Publisher, OrderCreatedEvent, Subjects } from '@planet-express/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}