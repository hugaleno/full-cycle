import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface"
import CreateProductUseCase from "./create.product.usecase"


const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}

describe("Unit test create product usecase", () => {


  it("should create a product", async () => {
    const input = {
      type: "a",
      name: "Product 1",
      price: 100
    }
    const productRepository: ProductRepositoryInterface = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const output = await createProductUseCase.execute(input);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price
    });
  });


  it("should thrown an error when the name is missing", async () => {
    const input = {
      type: "a",
      name: "Product 1",
      price: 100
    }
    const productRepository: ProductRepositoryInterface = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    input.name="";

    await expect(createProductUseCase.execute(input)).rejects.toThrow("Name is required");
  });

  it("should thrown an error when the price is less then zero", async () => {
    const input = {
      type: "a",
      name: "Product 1",
      price: 100
    }
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    input.price = -100;

    await expect(createProductUseCase.execute(input)).rejects.toThrow("Price must be greater than zero");
  });

  it("should thrown an error when the type is invalid", async () => {
    const input = {
      type: "a",
      name: "Product 1",
      price: 100
    }
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    input.type = "c";

    await expect(createProductUseCase.execute(input)).rejects.toThrow("Product type not supported");
  });
})