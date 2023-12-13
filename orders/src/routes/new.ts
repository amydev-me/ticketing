import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { requireAuth, validationRequest, NotFoundError, BadRequestError } from '@amytickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// 15 minutes
const EXPIRATIONN_WINDOW_SECONDS = 15 * 50;

router.post('/api/orders', 
    requireAuth,    
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TicketId must be provided')
    ], 
    validationRequest, 
    async(req:Request, res: Response) => {
        const { ticketId } = req.body;

        const ticket = await Ticket.findById(ticketId);

        if(!ticket){
            throw new NotFoundError();
        }

        const isReserved = await ticket.isReserved();

        if(isReserved){
            throw new BadRequestError('Ticket is already reserved.');
        }

        const expiration = new Date();
        // 15 minutes
        expiration.setSeconds(expiration.getSeconds() + EXPIRATIONN_WINDOW_SECONDS);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration, 
            ticket
        });

        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });

        res.status(201).send(order);
    }   
); 

export { router as newOrderRouter };