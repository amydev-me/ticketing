import { OrderCancelledEvent, OrderStatus } from "@amytickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId =  new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build( {
        title: 'concert',
        price: 10,
        userId : new mongoose.Types.ObjectId().toHexString()
    });
    ticket.set({ orderId });

    await ticket.save();

    // create a fake message object
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId };
}

it('updates the ticket, publishes an evennt, and acks the message', async () => {
    const { listener, ticket, data, msg, orderId } = await setup();

    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id);

    expect(updateTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});