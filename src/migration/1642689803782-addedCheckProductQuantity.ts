import {MigrationInterface, QueryRunner} from "typeorm";

export class addedCheckProductQuantity1642689803782 implements MigrationInterface {
    name = 'addedCheckProductQuantity1642689803782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "CHK_9f7497ededa7b72c2388e62431" CHECK ("quantity" > 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "CHK_9f7497ededa7b72c2388e62431"`);
    }

}
