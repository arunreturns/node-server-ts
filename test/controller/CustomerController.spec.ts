import * as request from "supertest";
import app from "../../src";

describe("Customer Controller", function() {
  beforeEach(() => {});
  describe("/getCustomers", () => {
    return request(app)
      .get("/customer/getCustomer")
      .expect(200, () => {});
  });
});
