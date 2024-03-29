import  { Message  } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subject';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], message: Message): void {
        
        console.log('Event data!', data.id);
        console.log('Event data!', data.title);
        console.log('Event data!', data.price);

        message.ack();
    }

}