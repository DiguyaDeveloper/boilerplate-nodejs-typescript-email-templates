
import { MigrationInterface, QueryRunner } from 'typeorm';

import { State } from '../../api/models';
import { ListStatesOfBrasil } from '../../api/shared/enum/state-of-brazil.enum';

export class StateOfBrazilMigration1589909805726 implements MigrationInterface {
    public name = 'stateOfBrazilMigration1589909805726';

  public async up(queryRunner: QueryRunner): Promise<void> {

      console.log('************** INSERT DEFAULT DATA COUNTRY **************');

      ListStatesOfBrasil.forEach(async element => {
        const state = new State(element.name, element.code, 32);
        await queryRunner.manager.save(state);
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `state`', undefined);
  }
}
