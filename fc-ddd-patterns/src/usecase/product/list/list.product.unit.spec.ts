import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

const productA = ProductFactory.create("a", "productA", 100);
const productB = ProductFactory.create("b", "productB", 50);


const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([productA, productB])),
    find: jest.fn(),
    update: jest.fn()
  }
}

describe("Unit test for listing product usecase", () => {
  it("it should list all products", async () => {
    const productRepository = MockRepository();
    const listUseCase = new ListProductUseCase(productRepository);

    const output = await listUseCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toEqual(expect.any(String));
    expect(output.products[0].name).toBe(productA.name);
    expect(output.products[0].price).toBe(productA.price);
    expect(output.products[1].id).toEqual(expect.any(String));
    expect(output.products[1].name).toBe(productB.name);
    expect(output.products[1].price).toBe(productB.price);
  })
})
