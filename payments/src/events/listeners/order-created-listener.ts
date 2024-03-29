import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@amytickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
 
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = await Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        })

        await order.save();
        
        // ack the message
        msg.ack();
    }
}