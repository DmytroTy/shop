import {MigrationInterface, QueryRunner} from "typeorm";

export class reconstructionOrders1641983569101 implements MigrationInterface {
    name = 'reconstructionOrders1641983569101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`);
        await queryRunner.query(`DROP TABLE "order_product"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderProducts" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderProducts"`);
        await queryRunner.query(`CREATE TABLE "order_product" ("quantity" integer NOT NULL, "order" integer NOT NULL, "product" integer NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_81c60b74033a66aba80c1213874" PRIMARY KEY ("order", "product"))`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
