import {MigrationInterface, QueryRunner} from "typeorm";

export class AddShopEntities1640862310778 implements MigrationInterface {
    name = 'AddShopEntities1640862310778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "color" character varying NOT NULL, "price" numeric NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "deletedAt" TIMESTAMP, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_product" ("quantity" integer NOT NULL, "order" integer NOT NULL, "product" integer NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_81c60b74033a66aba80c1213874" PRIMARY KEY ("order", "product"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('openly', 'processed', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "status" "public"."order_status_enum" NOT NULL DEFAULT 'openly', "deletedAt" TIMESTAMP, "buyerId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buyer" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying, "expiresIn" TIMESTAMP, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_7911d7b9e729513dec55983fc50" UNIQUE ("email"), CONSTRAINT "PK_0480fc3c7289846a31b8e1bc503" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "buyer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`);
        await queryRunner.query(`DROP TABLE "buyer"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_product"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
