import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

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

  it("should update a product", async () => {
    const input = {
      type: "a",
      name: "Product 1",
      price: 100
    }

    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);
    
    const pcreated = await usecase.execute(input)

    const inputUpdate = {
      id: pcreated.id,
      name: "Product 1 renamed",
      price: 200
    }
    const updateUsecase = new UpdateProductUseCase(productRepository);

    const output = await updateUsecase.execute(inputUpdate)


    expect(output).toEqual({
      id: pcreated.id,
      name: inputUpdate.name,
      price: inputUpdate.price
    });
  });
})