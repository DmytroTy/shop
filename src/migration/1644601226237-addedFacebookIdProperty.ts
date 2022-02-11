import {MigrationInterface, QueryRunner} from "typeorm";

export class addedFacebookIdProperty1644601226237 implements MigrationInterface {
    name = 'addedFacebookIdProperty1644601226237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buyer" ADD "facebookId" character varying`);
        await queryRunner.query(`ALTER TABLE "buyer" ADD CONSTRAINT "UQ_6a26dcfdb08fb5694e566e995a1" UNIQUE ("facebookId")`);
        await queryRunner.query(`ALTER TABLE "buyer" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buyer" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "buyer" DROP CONSTRAINT "UQ_6a26dcfdb08fb5694e566e995a1"`);
        await queryRunner.query(`ALTER TABLE "buyer" DROP COLUMN "facebookId"`);
    }

}
