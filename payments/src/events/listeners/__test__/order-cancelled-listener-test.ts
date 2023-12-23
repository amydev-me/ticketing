import { OrderCancelledEvent, OrderStatus } from "@amytickets/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { Order } from "../../../models/order";
import mongoose from "mongoose";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
                    id:new mongoose.Types.ObjectId().toHexString(),
                    status: OrderStatus.Created,
                    version: 0,
                    price: 20,
                    userId: new mongoose.Types.ObjectId().toHexString(),
                });
    await order.save();


    // create a fake message object
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString()
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order };
}

it('replicate the order info', async () => {
    const { listener, data, msg, order } = await setup();

    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
}); 