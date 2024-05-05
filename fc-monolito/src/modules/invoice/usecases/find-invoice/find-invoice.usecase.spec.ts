import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

const items: InvoiceItems[] = [
  new InvoiceItems({id: new Id("1"),name: "Item 1", price: 100}), 
  new InvoiceItems({id: new Id("2"),name: "Item 2", price: 200})
];

const invoiceProps = {
  id: new Id("1"),
  name: "invoice 1",
  document: "document invoice 1",
  address: new Address(
    "Rua 1", 
    "123", 
    "detras", 
    "Vice city", 
    "Acula", 
    "121212"
  ),
  items: items,
};
const invoice = new Invoice(invoiceProps);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn(),
  };
};

describe("Find invoice usecase unit test", () => {

  it("Should find an invoice", async () => {
    const repository = MockRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(repository);

    const output = await findInvoiceUseCase.execute({id: "1"})
    expect(output.id).toEqual(invoice.id.id);
    expect(output.name).toEqual(invoice.name);
    expect(output.document).toEqual(invoice.document);
    expect(output.address).toEqual(invoice.address);
    expect(output.items).toEqual([
      { id: "1", name: "Item 1", price: 100 },
      { id: "2", name: "Item 2", price: 200 },
    ]);

    expect(output.total).toEqual(300);
  })
});