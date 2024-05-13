import express, { Request, Response } from "express";

import { ProductAdmFacadeFactory } from "../../modules/product-adm/factory/facade.factory";

export const productsRoute = express.Router();

productsRoute.post("/", async (request: Request, response: Response) => {
  const facade = ProductAdmFacadeFactory.create();

  try {

    const productDto = {
      id: request.body.id,
      name: request.body.name,
      description: request.body.description,
      stock: request.body.stock,
      purchasePrice: request.body.purchasePrice,
      salesPrice: request.body.salesPrice
    };

    await facade.addProduct(productDto);

    response.status(201).send();
  } catch (error) {
    response.status(400).send(error);
  }
});