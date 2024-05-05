import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceFacadeFactory } from "../factory/facade.factory";

describe("Facade invoice unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "1",
      complement: "Perto daquele canto",
      city: "Desconhecida",
      state: "Desconhecido",
      zipCode: "11111111",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 21,
        },
        {
          id: "2",
          name: "Item 2",
          price: 114,
        },
      ],
    };

    const invoice = await invoiceFacade.generate(input);
    const invoiceDB = await InvoiceModel.findOne({
      where: { id: invoice.id },
    });

    expect(invoice.id).toBeDefined();
    expect(invoiceDB.id).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toEqual(input.document);
    expect(invoice.items).toEqual(input.items);
    expect(invoice.total).toEqual(135);

    expect(invoice.street).toEqual(input.street);
    expect(invoice.number).toEqual(input.number);
    expect(invoice.complement).toEqual(input.complement);
    expect(invoice.city).toEqual(input.city);
    expect(invoice.state).toEqual(input.state);
    expect(invoice.zipCode).toEqual(input.zipCode);
  });

  it("should find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();
    const items: InvoiceItems[] = [new InvoiceItems({id: new Id("1"),name: "Item 1", price: 100}), new InvoiceItems({id: new Id("2"),name: "Item 2", price: 150})];
    const invoiceDb = await InvoiceModel.create({
      id: "1",
      name: "Invoice 2",
      document: "Document 2",
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

    const result = await invoiceFacade.findOne({ id: "1" });

    expect(result.id).toEqual(invoiceDb.id);
    expect(result.name).toEqual(invoiceDb.name);
    expect(result.document).toEqual(invoiceDb.document);
    expect(result.total).toEqual(250);
    expect(result.items.length).toEqual(2);

    expect(result.address).toEqual(
      new Address(
        "street",
        "number",
        "complement",
        "city",
        "state",
        "zipCode",
      )
    );
  });
});