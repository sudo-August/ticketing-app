import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@planet-express/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// for proper deployment change to env variable
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders', 
  requireAuth, 
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket ID must be provided')
  ], 
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure that the ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('ticket is already reserved');
    }

    // calculate an expiration date/time for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });

    try {
      await order.save();
    } catch {
      throw new BadRequestError('error saving to database');
    }

    // publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price 
      }
    });

    res.status(201).send(order)
});

export { router as createOrderRouter };