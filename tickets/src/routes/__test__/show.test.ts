import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`/api/tickets/${id}`)
            .set('Cookie', global.signin()) 
            .send()
            expect(404);
 });

 it('returns the ticket if the ticket is found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app).post('/api/tickets')
                        .set('Cookie', global.signin())
                        .send({
                            title, price
                        })
                        expect(201);

    const ticketRes = await request(app).get(`/api/tickets/${response.body.id}`)
                            .set('Cookie', global.signin())
                            .send()
                            .expect(200);
    expect(ticketRes.body.title).toEqual(title);
    expect(ticketRes.body.price).toEqual(price);

 });