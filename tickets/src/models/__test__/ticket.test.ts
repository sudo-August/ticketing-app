import { Ticket } from '../ticket';

it('implements optimistic concurrency control (OCC)', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '23abc'
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 25 });
  secondInstance!.set({ price: 30 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch {
    return;
  }

  throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'abc1'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});