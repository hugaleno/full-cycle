import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import CustomerCreatedEvent from "./customer-created.event";
import SendConsoleLogWhenAddressIsChangedHandler from "./handler/send-console-log-when-customer-address-is-changed.handler";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "./handler/send-console-log1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "./handler/send-console-log2-when-customer-is-created.handler";

describe("Customer events tests", () => {
  
  it("should notify all event handlers when a customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const consoleLog1Handler = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const consoleLog2Handler = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    const spyConsoleLog1Handler = jest.spyOn(consoleLog1Handler, "handle");
    const spyConsoleLog2Handler = jest.spyOn(consoleLog2Handler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", consoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", consoleLog2Handler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(consoleLog1Handler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(consoleLog2Handler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "123",
      name: "Customer 1",
      address: {
        street: "Rua Agosto de Deus",
        number: 123123,
        zip: "60111-222",
        city:"Céu azul"
      }
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyConsoleLog1Handler).toHaveBeenCalled();
    expect(spyConsoleLog2Handler).toHaveBeenCalled();
  });

  it("should notify all event handlers when a customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const consoleLogHandler = new SendConsoleLogWhenAddressIsChangedHandler();
    const spyConsoleLogHandler = jest.spyOn(consoleLogHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", consoleLogHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(consoleLogHandler);

    const customerAdressChangedEvent = new CustomerAddressChangedEvent({
      id: "123",
      name: "Customer 1",
      address: {
        street: "Rua Agosto de Deus",
        number: 123,
        zip: "60111-222",
        city:"Céu azul"
      }
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerAdressChangedEvent);

    expect(spyConsoleLogHandler).toHaveBeenCalled();

  });
});
