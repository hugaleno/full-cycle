import OrderItem from "./order_item";
export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }

    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.total(), 0);
  }

  addItem(item: OrderItem){
    if(this.validateItem(item)){
      this.items.push(item);
    }
  }

  validateItem(item: OrderItem): boolean {
    if (item.id === null) {
      throw new Error("Id is required");
    }
    if (item.name === null) {
      throw new Error("Item name is required");
    }
    if (item.name.length === 0) {
      throw new Error("Item name is required");
    }
    if (item.price === null) {
      throw new Error("Price is required");
    }
    if (item.price <= 0) {
      throw new Error("Price cannot be less than zero");
    }
    if (item.productId === null) {
      throw new Error("Product id should be informed");
    }
    if (item.quantity <= 0) {
      throw new Error("Quantity should be greater then zero");
    }

    return true;
  }
}
