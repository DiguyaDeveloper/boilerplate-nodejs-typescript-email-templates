import { useContainer } from 'class-validator';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';
import { createConnection, getConnectionOptions } from 'typeorm';

import { env } from '../env';
import { CustomTypeOrmLogger, getLogger } from '../lib/logger';

const logger = getLogger(__filename);

export const typeormLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
) => {
  const loadedConnectionOptions = await getConnectionOptions();

  logDbConfig();
  useContainer(Container);

  const connectionOptions = Object.assign(loadedConnectionOptions, {
    type: env.db.type as any, // See createConnection options for valid types
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    synchronize: env.db.synchronize,
    logging: 'all' || env.db.logging,
    logger: new CustomTypeOrmLogger(),
    entities: env.app.dirs.entities,
  });

  const connection = await createConnection(connectionOptions);

  if (settings) {
    settings.setData('connection', connection);
    settings.onShutdown(() => connection.close());
  }
};

function logDbConfig(): void {
  logger.info('Init database connection');
  logger.info('Database type: ' + env.db.type);
  logger.info('Database name: ' + env.db.database);
  logger.info('Database password: ' + env.db.password);
}
