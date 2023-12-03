import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest, NotFoundError, NotAuthorizedError } from '@amytickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, async (req:Request, res:Response) => {
    const { title, price} = req.body;

    const ticket =  await   Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError();
    }
     res.status(200).send(ticket);
});

export { router as updateTicketRouter };