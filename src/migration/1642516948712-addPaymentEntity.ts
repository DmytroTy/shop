import {MigrationInterface, QueryRunner} from "typeorm";

export class addPaymentEntity1642516948712 implements MigrationInterface {
    name = 'addPaymentEntity1642516948712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "customerId" character varying NOT NULL, "transactionId" character varying NOT NULL, "buyerId" integer, "orderId" integer, CONSTRAINT "REL_d09d285fe1645cd2f0db811e29" UNIQUE ("orderId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_3297a8d685830f18b06a94d687b" FOREIGN KEY ("buyerId") REFERENCES "buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_3297a8d685830f18b06a94d687b"`);
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
