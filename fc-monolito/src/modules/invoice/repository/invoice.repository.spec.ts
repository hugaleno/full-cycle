import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceModel } from "./invoice.model";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items";
import Invoice from "../domain/invoice";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const items: InvoiceItems[] = [new InvoiceItems({id: new Id("1"),name: "Item 1", price: 100})];

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
    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.generate(invoice);

    const invoiceDb = await invoiceRepository.find(invoiceProps.id.id);
    
    expect(invoiceProps.id.id).toEqual(invoiceDb.id.id);
    expect(invoiceProps.name).toEqual(invoiceDb.name);
    expect(invoiceProps.document).toEqual(invoiceDb.document);
    expect(invoiceProps.address.street).toEqual(invoiceDb.address.street);
    expect(invoiceProps.address.number).toEqual(invoiceDb.address.number);
    expect(invoiceProps.address.complement).toEqual(invoiceDb.address.complement);
    expect(invoiceProps.address.city).toEqual(invoiceDb.address.city);
    expect(invoiceProps.address.state).toEqual(invoiceDb.address.state);
    expect(invoiceProps.address.zipCode).toEqual(invoiceDb.address.zipCode);
    expect(invoiceProps.items.length).toBe(1);
    expect(invoiceProps.items[0].id).toEqual(invoiceDb.items[0].id);
    expect(invoiceProps.items[0].name).toEqual(invoiceDb.items[0].name);
    expect(invoiceProps.items[0].price).toEqual(invoiceDb.items[0].price);
  });

  it("should find a invoice", async () => {
    const items: InvoiceItems[] = [new InvoiceItems({id: new Id("1"),name: "Item 1", price: 100})];

    const invoiceCreated = await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "Document 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: items.map(item => ({id: item.id.id, name: item.name, price: item.price})),
      address: {
        street: "street",
        city: "city",
        complement: "complement",
        number: "number",
        state: "state",
        zipCode: "zipCode",
      },
    });
    const invoiceRepository = new InvoiceRepository();
    const invoiceDb = await invoiceRepository.find("1");

    expect(invoiceCreated.id).toEqual(invoiceDb.id.id);
    expect(invoiceCreated.name).toEqual(invoiceDb.name);
    expect(invoiceCreated.document).toEqual(invoiceDb.document);
    expect(invoiceCreated.address.street).toEqual(invoiceDb.address.street);
    expect(invoiceCreated.address.number).toEqual(invoiceDb.address.number);
    expect(invoiceCreated.address.complement).toEqual(invoiceDb.address.complement);
    expect(invoiceCreated.address.city).toEqual(invoiceDb.address.city);
    expect(invoiceCreated.address.state).toEqual(invoiceDb.address.state);
    expect(invoiceCreated.address.zipCode).toEqual(invoiceDb.address.zipCode);
    expect(invoiceCreated.items.length).toBe(1);
    expect(invoiceCreated.items[0].id).toEqual(invoiceDb.items[0].id.id);
    expect(invoiceCreated.items[0].name).toEqual(invoiceDb.items[0].name);
    expect(invoiceCreated.items[0].price).toEqual(invoiceDb.items[0].price);
  });
});
