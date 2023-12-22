import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest, BadRequestError, NotFoundError } from '@amytickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
], validationRequest, async (req:Request, res:Response) => {
    res.send({ success: true });
});

export { router as createChargeRouter };