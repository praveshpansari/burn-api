import { Container } from "inversify";
import AuthResolver from "./resolvers/auth.resolver";
import UserResolver from "./resolvers/user.resolver";
import AuthenticationService from "./services/auth.service";
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
    container.bind(AuthResolver).toSelf();
    container.bind(AuthenticationService).toSelf();

    ApplicationContainer.container = container;
    return container;
  }
}
