import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CreateProductUseCase from "../create/create.product.usecase";
import ListProductUseCase from "./list.product.usecase";

describe("Test find product usecase", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list products", async () => {
    const inputProductA = {
      type: "a",
      name: "Product A",
      price: 50
    }
    const inputProductB = {
      type: "b",
      name: "Product B",
      price: 100
    }
    const productRepository = new ProductRepository();
    const createUsecase = new CreateProductUseCase(productRepository);
    const listUseCase = new ListProductUseCase(productRepository);

    await createUsecase.execute(inputProductA);
    await createUsecase.execute(inputProductB);

    const input = {};

    const output = await listUseCase.execute(input)

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toEqual(expect.any(String));
    expect(output.products[0].name).toBe(inputProductA.name);
    expect(output.products[0].price).toBe(inputProductA.price);
    expect(output.products[1].id).toEqual(expect.any(String));
    expect(output.products[1].name).toBe(inputProductB.name);
    expect(output.products[1].price).toBe(inputProductB.price*2);
  })
})