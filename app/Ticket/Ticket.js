import Model from "../Base/Model";
import models from '../../db/models';
const {
  Ticket: TicketModel,
} = models;

class Ticket extends Model {
  constructor() {
    super(TicketModel);
  }
};

export default new Ticket;
