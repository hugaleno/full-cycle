
import ClientGateway from "../../gateway/client.gateway";
import { FindClientUseCaseInputDto, FindClientUseCaseOutputDto } from "./find-client.usecase.dto";

export default class FindClientUseCase {

  private _clientRepository: ClientGateway

  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository
  }

  async execute(input: FindClientUseCaseInputDto): Promise<FindClientUseCaseOutputDto> {

    const result = await this._clientRepository.find(input.id)

    return {
      id: result.id.id,
      name: result.name,
      email: result.email,
      document: result.document,
      street:  result.street,
      number: result.number,
      complement: result.complement,
      city: result.city,
      state: result.state,
      zipCode:  result.zipCode,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }
  }
}