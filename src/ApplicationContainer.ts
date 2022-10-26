import { Container } from "inversify";
import UserResolver from "./resolvers/user.resolver";
import UserService from "./services/user.service";

export class ApplicationContainer {
  private static container: Container | undefined;

  public static createContainer(): Container {
    if (ApplicationContainer.container) {
      return ApplicationContainer.container;
    }

    const container = new Container();

    container.bind(UserResolver).toSelf();
    container.bind(UserService).toSelf();

    ApplicationContainer.container = container;
    return container;
  }
}
