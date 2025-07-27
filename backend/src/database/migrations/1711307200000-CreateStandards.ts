import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStandards1711307200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'standards',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'standard_name',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'is_selectable',
            type: 'tinyint',
            width: 1,
            default: 1,
          },
          {
            name: 'created_user_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_user_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_user_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create index on standard_name for faster lookups
    await queryRunner.createIndex(
      'standards',
      new TableIndex({
        name: 'IDX_STANDARDS_NAME',
        columnNames: ['standard_name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.dropIndex('standards', 'IDX_STANDARDS_NAME');
    
    // Drop table
    await queryRunner.dropTable('standards');
  }
} 