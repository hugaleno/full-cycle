import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Test find customer usescase", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a customer", async () => {
    
    const customerRepository = new CustomerRepository();
    const usecase = new FindCustomerUseCase(customerRepository);

    const customer = new Customer("123", "customer1");
    const address = new Address("rua", 111, "122122122", "cidade");

    customer.changeAddress(address);

    await customerRepository.create(customer);

    const input = { id: "123" };

    const output = {
      id: "123",
      name: "customer1",
      address: {
        street: "rua",
        city: "cidade",
        number: 111,
        zip: "122122122"
      }
    }
    const result = await usecase.execute(input)

    expect(result).toEqual(output)
  })
})