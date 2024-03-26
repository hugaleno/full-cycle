
import { toXML } from "jstoxml";
import { OuputListCustomerDto } from "../../../usecase/customer/list/list.customer.dto";
import { number } from "yup";

export default class CustomerPresenter {

  static listXML(data: OuputListCustomerDto): string {
    const xmlOption = {
      header: true,
      indent: " ",
      newline: "\n",
      allowEmpty: true,
    }

    return toXML({
      customers: {
        customer : data.customers.map((customer)=> ({
          id: customer.id,
          name: customer.name,
          address: {
            street: customer.address.street,
            city: customer.address.city,
            number: customer.address.number,
            zip: customer.address.zip
          }
        })),
      },
    },
      xmlOption
    );
      
  }
}