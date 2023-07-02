import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1688299349090 implements MigrationInterface {
  name = 'Migrations1688299349090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contact" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "linkPrecedence" character varying NOT NULL, "linkedId" integer, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ADD CONSTRAINT "FK_860a3f5d23b62cc0f1a2297a1ea" FOREIGN KEY ("linkedId") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contact" DROP CONSTRAINT "FK_860a3f5d23b62cc0f1a2297a1ea"`,
    );
    await queryRunner.query(`DROP TABLE "contact"`);
  }
}
