import express, { Request, Response } from "express";

import { ClientAdmFacadeFactory } from "../../modules/client-adm/factory/client-adm.facade.factory";
import { AddClientFacadeInputDto } from "../../modules/client-adm/facade/client-adm.facade.interface";

export const clientsRoute = express.Router();

clientsRoute.post("/", async (request: Request, response: Response) => {
  const facade = ClientAdmFacadeFactory.create();

  try {
    const restClient = request.body;

    const clientDto: AddClientFacadeInputDto = {
      id: restClient.id,
      name:restClient.name,
      email: restClient.email,
      document: restClient.document,
      street:restClient.street,
      city: restClient.city,
      complement: restClient.complement,
      number: restClient.number,
      state: restClient.state,
      zipCode: restClient.zipCode,      
    };

    await facade.add(clientDto);

    response.status(201).send();
  } catch (error) {
    response.status(400).send(error);
  }
});