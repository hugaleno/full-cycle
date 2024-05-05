import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";

interface ItemData {
  id: string;
  name: string;
  price: number;
}

interface AddressData {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
}

@Table({
  tableName: "invoices",
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false, type: DataType.JSON })
  address: AddressData;

  @Column({ allowNull: false, type: DataType.JSON })
  items: ItemData[];

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
