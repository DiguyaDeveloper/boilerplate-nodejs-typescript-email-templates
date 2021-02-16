import { Application } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Action, createExpressServer } from 'routing-controllers';
import { Container } from 'typedi';

import { User } from '../api/models/user-models/User.model';
import { SecurityService } from '../api/services/Auth.service';
import { UsuarioService } from '../api/services/UsuarioService';
import { env } from '../env';

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  if (settings) {
    /**
     * We create a new express server instance.
     * We could have also use useExpressServer here to attach controllers to an existing express instance.
     */

    const expressApp: Application = createExpressServer({
      cors: true,
      classTransformer: true,
      routePrefix: env.app.routePrefix,
      defaultErrorHandler: true,
      validation: true,
      /**
       * We can add options about how routing-controllers should configure itself.
       * Here we specify what controllers should be registered in our express server.
       */
      controllers: env.app.dirs.controllers,
      middlewares: env.app.dirs.middlewares,
      interceptors: env.app.dirs.interceptors,

      /**
       * Authorization features
       */
      authorizationChecker,
      currentUserChecker,
    });

    // useContainer(expressApp);

    // Run application to listen on given port
    if (!env.isTest) {
      const server = expressApp.listen(env.app.port);
      settings.setData('express_server', server);
    }

    // Here we can set the data for other loaders
    settings.setData('express_app', expressApp);
  }
};

async function authorizationChecker(
  action: Action,
  roles: string[]
): Promise<boolean> {
  const user = await currentUserChecker(action);
  return !!user;
}

async function currentUserChecker(action: Action): Promise<User> {
  const token = action.request.headers.authorization?.split('Bearer ')[1];
  const securityService = Container.get(SecurityService);
  const userService = Container.get(UsuarioService);
  try {
    const decoded = await securityService.verifyToken(token);
    const user = await userService.findOne({ where: { id: decoded.id } });
    return !!user.token && user.token === token ? user : undefined;
  } catch (e) {
    return undefined;
  }
}
