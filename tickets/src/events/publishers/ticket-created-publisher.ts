import { Publisher, Subjects, TicketCreatedEvent } from "@amytickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    
}