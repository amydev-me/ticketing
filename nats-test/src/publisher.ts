import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const client = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

client.on('connect', async () => {
  
    const publisher = new TicketCreatedPublisher(client);

    try{
      await publisher.publish({
        id: '123',
        title: 'concert',
        price: 20,
      });
    }
    catch(error){
      console.log(error);
    }
   
    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });

    // client.publish('ticket:created', data, () => {
    //     console.log('Event Published')
    // })
})