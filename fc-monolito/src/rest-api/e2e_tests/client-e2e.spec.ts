import { app } from "../express";
import { Sequelize } from "sequelize-typescript"
import request from "supertest";
import { ClientModel } from "../../modules/client-adm/repository/client.model";

describe("Client e2e test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      })
  
      await sequelize.addModels([ClientModel])
      await sequelize.sync()
    })
  
    afterEach(async () => {
      await sequelize.close()
    })

    it("should create a client", async () => {
        const input = {
            id: "1",
            name: "Client 1",
            email: "client1@email",
            document: "document",
            street: "Street 1",
            number: "100",
            complement: "Complement",
            city: "Imaginary",
            state: "RS",
            zipCode: "1111-111"
        }
        const clientResponse = await request(app)
            .post("/clients")
            .send(input);
  
        const client = await ClientModel.findOne({ where: { id: "1" } })

        expect(clientResponse.status).toEqual(201);
        expect(client.id).toEqual(input.id)
        expect(client.name).toEqual(input.name)
        expect(client.email).toEqual(input.email)
        expect(client.document).toEqual(input.document)
        expect(client.street).toEqual(input.street)
        expect(client.number).toEqual(input.number)
        expect(client.complement).toEqual(input.complement)
        expect(client.city).toEqual(input.city)
        expect(client.state).toEqual(input.state)
        expect(client.zipCode).toEqual(input.zipCode)
        expect(client.createdAt).toBeDefined()
        expect(client.updatedAt).toBeDefined()
    
    });
})