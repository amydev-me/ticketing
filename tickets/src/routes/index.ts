import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, NotFoundError } from '@amytickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', requireAuth, async (req:Request, res:Response) => {
    const tickets = await Ticket.findById({});
    
    res.send(tickets);
});

export { router as indexTicketRouter };