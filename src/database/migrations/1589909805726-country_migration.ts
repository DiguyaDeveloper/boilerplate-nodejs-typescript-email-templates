import { MigrationInterface, QueryRunner } from 'typeorm';

import { Country } from '../../api/models';
import { ListCountries } from '../../api/shared/enum/contries.enum';

export class CountryMigration1589909805726 implements MigrationInterface {
    public name = 'countryMigration1589909805726';

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log('************** INSERT DEFAULT DATA COUNTRY **************');

        ListCountries.forEach(async element => {
        const country = new Country(element.name, element.cod);
        await queryRunner.manager.save(country);
        });
    }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `country`', undefined);
  }

}
