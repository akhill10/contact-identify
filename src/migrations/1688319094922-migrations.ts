import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1688319094922 implements MigrationInterface {
  name = 'Migrations1688319094922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contact" ALTER COLUMN "phoneNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ALTER COLUMN "email" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e48813080c4f2ce7ffaca44e4" ON "contact" ("phoneNumber") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eff09bb429f175523787f46003" ON "contact" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eff09bb429f175523787f46003"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e48813080c4f2ce7ffaca44e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ALTER COLUMN "email" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ALTER COLUMN "phoneNumber" SET NOT NULL`,
    );
  }
}
