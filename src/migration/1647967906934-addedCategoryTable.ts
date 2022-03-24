import {MigrationInterface, QueryRunner} from "typeorm";

export class addedCategoryTable1647967906934 implements MigrationInterface {
    name = 'addedCategoryTable1647967906934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "parentId" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories_products" ("categoryId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_70d2357e457346dbdabda54e1f3" PRIMARY KEY ("categoryId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_910238413cef9b27a401fdf5a5" ON "categories_products" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_17360d9b4b682e177e4421a4ac" ON "categories_products" ("productId") `);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories_products" ADD CONSTRAINT "FK_910238413cef9b27a401fdf5a51" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "categories_products" ADD CONSTRAINT "FK_17360d9b4b682e177e4421a4ac0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories_products" DROP CONSTRAINT "FK_17360d9b4b682e177e4421a4ac0"`);
        await queryRunner.query(`ALTER TABLE "categories_products" DROP CONSTRAINT "FK_910238413cef9b27a401fdf5a51"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17360d9b4b682e177e4421a4ac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_910238413cef9b27a401fdf5a5"`);
        await queryRunner.query(`DROP TABLE "categories_products"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
