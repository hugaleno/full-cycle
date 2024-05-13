import { app } from "../express";
import request from "supertest";
import { migrator } from "../../migrations/config-migrations/migrator"
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { ProductModel as StoreCatalogProductModel } from "../../modules/store-catalog/repository/product.model";
import { Umzug } from "umzug"
import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
describe("Checkout e2e tests", () => {
  let migration: Umzug<any>;
  let sequelize: Sequelize
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })

    sequelize.addModels([ProductModel, OrderModel, StoreCatalogProductModel, ClientModel, TransactionModel, InvoiceModel])
    migration = migrator(sequelize)
    await migration.up()
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  });

  it("should checkout", async () => {
    const clientsInput = {
      id: "1",
      name: "Client 1",
      email: "client1@email.com",
      document: "0000",
      street: "Street 1",
      number: "100",
      complement: "complement",
      city: "Cidade1",
      state: "state 1",
      zipCode: "111111",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const clientResponse = await request(app)
      .post("/clients")
      .send(clientsInput);

    expect(clientResponse.status).toBe(201);

    const productsInput = {
      id: "1p",
      name: "Product A",
      description: "Description Product A",
      purchasePrice: 66,
      salesPrice: 110,
      stock: 10
    }
    const productsResponse = await request(app)
      .post("/products")
      .send(productsInput);

    expect(productsResponse.status).toBe(201);
    const checkoutInput = {
      clientId: clientsInput.id,
      products: [
        {
          productId: productsInput.id
        }
      ]
    }
    const checkoutResponse = await request(app)
      .post("/checkout")
      .send(checkoutInput);

    expect(checkoutResponse.status).toBe(200)
    expect(checkoutResponse.body.id).toBeDefined()
    expect(checkoutResponse.body.invoiceId).toBeDefined()
    expect(checkoutResponse.body.status).toEqual("approved")
    expect(checkoutResponse.body.total).toEqual(productsInput.salesPrice)
    expect(checkoutResponse.body.products[0].productId).toEqual(checkoutInput.products[0].productId)

    const invoiceResponse = await request(app)
      .get("/invoice/" + checkoutResponse.body.invoiceId)

    expect(invoiceResponse.status).toEqual(200)
    expect(invoiceResponse.body.id).toEqual(checkoutResponse.body.invoiceId)
    expect(invoiceResponse.body.name).toEqual(clientsInput.name)
    expect(invoiceResponse.body.document).toEqual(clientsInput.document)
    expect(invoiceResponse.body.items[0].id).toEqual(productsInput.id)
    expect(invoiceResponse.body.items[0].name).toEqual(productsInput.name)
    expect(invoiceResponse.body.items[0].price).toEqual(productsInput.salesPrice)
    expect(invoiceResponse.body.total).toEqual(productsInput.salesPrice)
    expect(invoiceResponse.body.createdAt).toBeDefined()
  });
});