import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
    // create an innstance of a ticket

    const ticket = Ticket.build({
        title: 'ticket-1',
        price: 5,
        userId: '123'
    });

    // save the ticket to the database
    await ticket.save();

    // fetch the ticket twice
    const firstInst = await Ticket.findById(ticket.id);
    const secondInst = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets we fetched
    firstInst!.set({ price : 100 });
    secondInst!.set({ price : 200 });

    // save the first fetched ticket
    await firstInst!.save();

    // save the second fetched ticket and expect an error
    try {
        await secondInst!.save();
    }catch(err){
        return;
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'ticket-1',
        price: 5,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});