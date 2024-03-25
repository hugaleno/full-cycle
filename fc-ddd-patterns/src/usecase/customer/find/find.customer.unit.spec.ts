import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = new Customer("123", "customer1");
const address = new Address("rua", 111, "122122122", "cidade");
customer.changeAddress(address);

const MockRepository = () =>{
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}

describe("Unit test find customer usescase", () => {

  it("should find a customer", async () => {
    
    const customerRepository = MockRepository();
    const usecase = new FindCustomerUseCase(customerRepository);

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
  });

  it("should not find a customer", async () => {
    
    const customerRepository = MockRepository();
    customerRepository.find.mockImplementation(() => {
      throw new Error("Customer not found");
    })
    const usecase = new FindCustomerUseCase(customerRepository);

    const input = { id: "123" };

    expect(() => {
      return usecase.execute(input)
    }).rejects.toThrow("Customer not found")
  });
})