import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateProductionMethodTypes1711307300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'production_method_types',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type_name',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'standard_id',
            type: 'int',
            isNullable: false,
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

    // Create index on type_name for faster lookups
    await queryRunner.createIndex(
      'production_method_types',
      new TableIndex({
        name: 'IDX_PRODUCTION_METHOD_TYPES_NAME',
        columnNames: ['type_name'],
      }),
    );

    // Create foreign key to standards table
    await queryRunner.createForeignKey(
      'production_method_types',
      new TableForeignKey({
        name: 'FK_PRODUCTION_METHOD_TYPES_STANDARD',
        columnNames: ['standard_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'standards',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    await queryRunner.dropForeignKey('production_method_types', 'FK_PRODUCTION_METHOD_TYPES_STANDARD');
    
    // Drop index
    await queryRunner.dropIndex('production_method_types', 'IDX_PRODUCTION_METHOD_TYPES_NAME');
    
    // Drop table
    await queryRunner.dropTable('production_method_types');
  }
} 