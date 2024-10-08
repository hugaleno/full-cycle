import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export class FindInvoiceUseCase implements UseCaseInterface {
  private invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway){
    this.invoiceRepository = invoiceRepository;
  }
  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this.invoiceRepository.find(input.id);
    const items = invoice.items.map((item) => ({
      id: item.id.id,
      name: item.name,
      price: item.price,
    }));

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: invoice.address,
      items,
      total: invoice.total,
      createdAt: invoice.createdAt,
    };
  }

}