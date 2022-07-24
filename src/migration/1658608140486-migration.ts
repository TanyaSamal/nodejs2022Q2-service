import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class migration1658608140486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: '1',
          },
          {
            name: 'login',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'version',
            type: 'int4',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'artist',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: '1',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'grammy',
            type: 'bool',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'album',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: '1',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'year',
            type: 'int4',
          },
          {
            name: 'artistId',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'track',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: '1',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'artistId',
            type: 'uuid',
          },
          {
            name: 'albumId',
            type: 'uuid',
          },
          {
            name: 'duration',
            type: 'int4',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'favs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: '1',
          },
          {
            name: 'artists',
            type: 'text',
          },
          {
            name: 'albums',
            type: 'text',
          },
          {
            name: 'tracks',
            type: 'text',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('artist');
    await queryRunner.dropTable('album');
    await queryRunner.dropTable('track');
    await queryRunner.dropTable('favs');
  }
}
