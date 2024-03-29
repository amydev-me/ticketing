import { OrderCreatedEvent, OrderStatus } from "@amytickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create a fake message object
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created, 
        userId : new mongoose.Types.ObjectId().toHexString(),
        expiresAt: '2099',
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it('replicate the order info', async () => {
    const { listener, data, msg } = await setup();

    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
}); 