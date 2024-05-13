import { app } from "../express";
import { Sequelize } from "sequelize-typescript"
import request from "supertest";
import {InvoiceModel} from "../../modules/invoice/repository/invoice.model";
import Id from "../../modules/@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../modules/invoice/domain/invoice-items";

describe("Invoice e2e test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      });
  
      await sequelize.addModels([InvoiceModel])
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close()
    });

    it("should find a invoice", async () => {
      const items: InvoiceItems[] = [new InvoiceItems({id: new Id("1"),name: "Item 1", price: 100})];
        const invoice = {
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
          }
        }
        
          
        await InvoiceModel.create(invoice);

        const invoiceResponse = await request(app)
            .get("/invoice/" + invoice.id)
        
        expect(invoiceResponse.status).toEqual(200)
        expect(invoiceResponse.body.id).toEqual(invoice.id)
        expect(invoiceResponse.body.name).toEqual(invoice.name)
        expect(invoiceResponse.body.document).toEqual(invoice.document)
        expect(invoiceResponse.body.items[0].id).toEqual(invoice.items[0].id)
        expect(invoiceResponse.body.items[0].name).toEqual(invoice.items[0].name)
        expect(invoiceResponse.body.items[0].price).toEqual(invoice.items[0].price)
        expect(invoiceResponse.body.total).toEqual(invoice.items[0].price)
    });
})