import request from 'supertest';
import { app } from '../../app';

const creteTicket = () => {
    return request(app)
                .post('/api/tickets')
                .set('Cookie', global.signin())
                .send({
                    title: 'concert',
                    price: 20
                });
} 

it('can fetch all tickets', async () => {
    await creteTicket();
    await creteTicket();
    await creteTicket();
    const response = await request(app)
                        .get('/api/tickets')
                        .set('Cookie', global.signin())
                        .send()
                        .expect(200);

    expect(response.body.length).toEqual(3);
});