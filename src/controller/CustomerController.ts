import { Request, Response, Application } from "express";
import logger from "../config/LoggerConfig";
import CustomerService from "../service/CustomerService";
import Customer from "../models/Customer";

class CustomerController {
  static registerController(app: Application, url: string = `/customer`) {
    app.get(`${url}/getCustomer`, this.getCustomer);
    app.post(`${url}/addCustomer`, this.addCustomer);
    app.delete(`${url}/deleteCustomer/:id`, this.deleteCustomer);
  }

  static async getCustomer(_: Request, res: Response) {
    logger.info(`[${this.name}] Inside getCustomer`);
    const resp = await CustomerService.getCustomerFromDB();
    logger.info(`[${this.name}] getCustomer - Response`, resp);
    res.status(resp.status).send(resp.body);
  }

  static async addCustomer(req: Request, res: Response) {
    logger.info(`[${this.name}] Inside addCustomer`);
    const newCustomer = new Customer(
      req.body.name,
      req.body.email,
      req.body.phone,
    );
    const resp = await CustomerService.addCustomerToDB(newCustomer);
    logger.info(`[${this.name}] addCustomer - Response`, resp);
    res.status(resp.status).send(resp.body);
  }

  static async deleteCustomer(req: Request, res: Response) {
    logger.info(`[${this.name}] Inside deleteCustomer`);
    const resp = await CustomerService.deleteCustomerFromDB(req.params.id);
    logger.info(`[${this.name}] deleteCustomer - Response`, resp);
    res.status(resp.status).send(resp.body);
  }
}

export default CustomerController;
