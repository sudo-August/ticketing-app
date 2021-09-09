import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signInCookie } from '../../test/setup';

it('fetches the order', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = signInCookie();
  // make a request to build an order with the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns error if fetches order that does not belong to user', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = signInCookie();
  // make a request to build an order with the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signInCookie())
    .send()
    .expect(401);

});