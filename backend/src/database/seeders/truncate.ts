import dataSource from '../../../ormconfig';

const tableNames = [
  'production_method_types',
  'standards'
  // Thêm các bảng khác vào đây nếu cần
];

const truncateTables = async () => {
  try {
    // Initialize the connection
    await dataSource.initialize();
    console.log('Database connection established');

    // Disable foreign key checks
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    
    for (const tableName of tableNames) {
      try {
        await dataSource.query(`TRUNCATE TABLE ${tableName}`);
        console.log(`Truncated table: ${tableName}`);
      } catch (error) {
        console.error(`Error truncating ${tableName}:`, error.message);
      }
    }
    
    // Enable foreign key checks again
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('All tables truncated successfully');
    
    // Close the connection
    await dataSource.destroy();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the truncate
truncateTables(); 