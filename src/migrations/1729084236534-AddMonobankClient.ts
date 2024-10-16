import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMonobankClient1729084236534 implements MigrationInterface {
  name = 'AddMonobankClient1729084236534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "monobank_client" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "monobankKey" character varying NOT NULL,
                "monobankName" character varying NOT NULL,
                "userId" integer NOT NULL,
                CONSTRAINT "UQ_49bcff84c18d0d1409d59dd130e" UNIQUE ("monobankKey"),
                CONSTRAINT "PK_2f8b8e3b3fbdb4fef22a1ecddf7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ALTER COLUMN "userId"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "monobank_client"
            ADD CONSTRAINT "FK_4877f05792679838e000eeccba7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"
        `);
    await queryRunner.query(`
            ALTER TABLE "monobank_client" DROP CONSTRAINT "FK_4877f05792679838e000eeccba7"
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ALTER COLUMN "userId" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            DROP TABLE "monobank_client"
        `);
  }
}
