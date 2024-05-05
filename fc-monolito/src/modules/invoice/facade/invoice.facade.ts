import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { InvoiceFacadeInterface, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto, FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
  generateUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUseCase: UseCaseInterface;
  private _findUseCase: UseCaseInterface;

  constructor(useCasesProps: UseCaseProps) {
    this._generateUseCase = useCasesProps.generateUseCase;
    this._findUseCase = useCasesProps.findUseCase;
  }

  async generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateUseCase.execute(input);
  }

  async findOne(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUseCase.execute(input);
  }
}