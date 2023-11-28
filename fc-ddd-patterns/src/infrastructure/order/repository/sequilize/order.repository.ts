import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async(t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      });

      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));

      await OrderItemModel.bulkCreate(
        items,
        { transaction: t },
      );

      await OrderModel.update(
        {
          total: entity.total(),
        },
        { where: { id: entity.id }, transaction: t },
      );
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id } , include: [ "items"]});
    return new Order(
      orderModel.id, 
      orderModel.customer_id, 
      orderModel.items.map(
        (orderItemModel: OrderItemModel) =>
          new OrderItem(
            orderItemModel.id, 
            orderItemModel.name, 
            orderItemModel.price, 
            orderItemModel.product_id, 
            orderItemModel.quantity
          )
      )
    );
  }

  async findAll(): Promise<Order[]> {
    const orderModels: OrderModel[] = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });;

    return orderModels.map(om => {
      return new Order(
        om.id, 
        om.customer_id, 
        om.items.map(
          (orderItemModel: OrderItemModel) =>
            new OrderItem(
              orderItemModel.id, 
              orderItemModel.name, 
              orderItemModel.price, 
              orderItemModel.product_id, 
              orderItemModel.quantity
            )
        )
      );
    })
    
  }
}
