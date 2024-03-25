import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../entity/product";
import ProductInterface from "../entity/product.interface";
import ProductYupValidator from "../validator/product.yup.validator";

export default class ProductValidatorFactory {
  static create(): ValidatorInterface<ProductInterface> {
    return new ProductYupValidator();
  }
}