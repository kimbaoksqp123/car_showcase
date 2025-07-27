import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateFiles1711307100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'originalName',
            type: 'varchar',
          },
          {
            name: 'filename',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'path',
            type: 'varchar',
          },
          {
            name: 'mimetype',
            type: 'varchar',
          },
          {
            name: 'size',
            type: 'integer',
          },
          {
            name: 'uploadedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );
    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index first
    await queryRunner.dropIndex('files', 'IDX_FILES_FILENAME');
    // Then drop the table
    await queryRunner.dropTable('files');
  }
} 