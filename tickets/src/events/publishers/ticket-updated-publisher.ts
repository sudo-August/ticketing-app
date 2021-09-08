import { Publisher, Subjects, TicketUpdatedEvent } from "@planet-express/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}