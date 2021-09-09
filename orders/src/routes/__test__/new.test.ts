import request from 'supertest';
import { app } from '../../app';
import { signInCookie } from '../../test/setup';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  await request(app)
    .post('/api/orders')
    .send({})
    .expect(401)
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', signInCookie())
    .send({})

  expect(response.status).not.toEqual(401);
});

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signInCookie())
    .send({
      ticketId
    })
    .expect(404)
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  try {
    await ticket.save();
  } catch {
    console.log('error saving ticket to database')
  }

  const order = Order.build({
    ticket,
    userId: 'jfkdlsafjeio',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });

  try {
    await order.save();
  } catch {
    console.log('error saving order to database')
  }

  await request(app)
    .post('/api/orders')
    .set('Cookie', signInCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  try {
    await ticket.save();
  } catch {
    console.log('error saving ticket to database');
  }

  await request(app)
    .post('/api/orders')
    .set('Cookie', signInCookie())
    .send({ ticketId: ticket.id })
    .expect(201)
});

it('emits an event signaling the creation of an order', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  try {
    await ticket.save();
  } catch {
    console.log('error saving ticket to database');
  }

  await request(app)
    .post('/api/orders')
    .set('Cookie', signInCookie())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});