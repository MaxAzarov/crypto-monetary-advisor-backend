import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWallet1727548234621 implements MigrationInterface {
  name = 'CreateWallet1727548234621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "wallet" (
          "id" SERIAL NOT NULL,
          "accountAddress" character varying(42) NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "walletName" character varying NOT NULL,
          "userId" integer,
          CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id")
      )
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
      DROP TABLE "wallet"
  `);
  }
}
