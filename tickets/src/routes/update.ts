import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { 
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError

} from '@planet-express/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
  '/api/tickets/:id', 
  requireAuth, 
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('price must be provided and greater than 0')
  ], 
  validateRequest,
  async (req: Request, res: Response
) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket){
    throw new NotFoundError();
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price
  });
  try {
    await ticket.save();
  } catch (err) {
    console.log('error saving update to ticket')
    console.log(err)
  }

  res.send(ticket);
});

export { router as updateTicketRouter };