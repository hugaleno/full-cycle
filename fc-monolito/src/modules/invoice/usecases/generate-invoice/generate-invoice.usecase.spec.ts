import { GenerateInvoiceUseCase } from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    generate: jest.fn(),
  };
};

describe("GenerateInvoiceUseCase unit test", () => {

  it("Should generate an invoice", async () => {
    const repository = MockRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "1",
      complement: "Perto daquele canto",
      city: "Desconhecida",
      state: "Desconhecido",
      zipCode: "1111111",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 50,
        },
        {
          id: "2",
          name: "Item 2",
          price: 122,
        },
      ],
    };

    const output = await generateInvoiceUseCase.execute(input);
    expect(output.id).toBeDefined();
    expect(output.name).toEqual(input.name);
    expect(output.document).toEqual(input.document);
    expect(output.items).toEqual(input.items);
    expect(output.total).toEqual(172);

    expect(output.street).toEqual(input.street);
    expect(output.number).toEqual(input.number);
    expect(output.complement).toEqual(input.complement);
    expect(output.city).toEqual(input.city);
    expect(output.state).toEqual(input.state);
    expect(output.zipCode).toEqual(input.zipCode);
  })

});