import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository : CustomerRepository = new CustomerRepository();
    const customer: Customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const customerModel = await CustomerModel.findOne({ where: { id: "123"} });

    const productRepository: ProductRepository = new ProductRepository();
    const product: Product = new Product("123", "Produto 1", 100);
    await productRepository.create(product);


    const orderRepository: OrderRepository = new OrderRepository();
    const orderItem: OrderItem = new OrderItem("1",product.name, product.price, product.id, 5);
    const order: Order = new Order("123", customerModel.id, [ orderItem ]);
    await orderRepository.create(order);
    
    orderItem.addQuantity(5);

    await orderRepository.update(order);
  
  
    const orderModelUpdated = await OrderModel.findOne({
        where: { id: "123" },
        include: ["items"],
      });

    expect(orderModelUpdated.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          product_id: product.id,
          order_id: order.id,
          name: product.name,
          price: product.price,
          quantity: orderItem.quantity
        }
      ]
    });
    
  });

  it("should find a order", async () => {
    const customerRepository : CustomerRepository = new CustomerRepository();
    const customer: Customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const customerModel = await CustomerModel.findOne({ where: { id: "123"} });

    const productRepository: ProductRepository = new ProductRepository();
    const product: Product = new Product("123", "Produto 1", 100);
    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "123" } });

    const orderRepository: OrderRepository = new OrderRepository();
    const orderItem: OrderItem = new OrderItem("1",productModel.name, productModel.price, productModel.id, 5);
    const order: Order = new Order("123", customerModel.id, [ orderItem ]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: "123" },
      include: ["items"],
    });

    const foundOrder = await orderRepository.find("123");

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          order_id: order.id,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity
        }
      ],
    });
  });

  it("should find all orders", async () => {
    const customerRepository : CustomerRepository = new CustomerRepository();
    const productRepository: ProductRepository = new ProductRepository();
    const orderRepository: OrderRepository = new OrderRepository();

    const customer: Customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const product: Product = new Product("123", "Produto 1", 100);
    await productRepository.create(product);
     
    const orderItem: OrderItem = new OrderItem("1",product.name, product.price, product.id, 5);
    const order: Order = new Order("123", customer.id, [ orderItem ]);
    await orderRepository.create(order);
    

    const product2: Product = new Product("124", "Produto 2", 50);
    await productRepository.create(product2);

    const orderItem2: OrderItem = new OrderItem("2",product2.name, product2.price, product2.id, 5);
    const order2: Order = new Order("124", customer.id, [ orderItem2 ]);
    await orderRepository.create(order2);

    const orders = [ order, order2 ];

    const foundOrders = await orderRepository.findAll();

     expect(orders).toEqual(foundOrders);
  });

});
