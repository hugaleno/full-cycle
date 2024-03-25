import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress("joaquim", new Address("street", 123, "zip", "city"));
const customer2 = CustomerFactory.createWithAddress("Roberta", new Address("street2", 125, "zip2", "city2"));


const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
    find: jest.fn(),
    update: jest.fn()
  }
}

describe("Unit test for listing customer usecase", () => {
  it("it should list all customers", async () => {
    const customerRepository = MockRepository();
    const listUseCase = new ListCustomerUseCase(customerRepository);

    const output = await listUseCase.execute({});

    expect(output.customers.length).toBe(2);
    expect(output.customers[0].id).toBe(customer1.id);
    expect(output.customers[0].name).toBe(customer1.name);
    expect(output.customers[0].address.street).toBe(customer1.Address.street);
    expect(output.customers[1].id).toBe(customer2.id);
    expect(output.customers[1].name).toBe(customer2.name);
    expect(output.customers[1].address.street).toBe(customer2.Address.street);
  })
})
