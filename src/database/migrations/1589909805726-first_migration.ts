import { MigrationInterface, QueryRunner } from 'typeorm';

import { DefaultRole, Role } from '../../api/models/user-models/Role.model';

export class FirstMigration1589909805726 implements MigrationInterface {
    public name = 'firstMigration1589909805726';

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log('************** INSERT DEFAULT DATA ROLE **************');
        const userRole = new Role(DefaultRole.Usuario);
        userRole.name = 'Usuario';
        await queryRunner.manager.save(userRole);
        const adminRole = new Role(DefaultRole.Admin);
        adminRole.name = 'Admin';
        await queryRunner.manager.save(adminRole);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `usuario`', undefined);
        await queryRunner.query('DROP TABLE `role`', undefined);
    }

}
