import dataSource from '../../../ormconfig';
import ProdSeeder from './seeder';

const seedDatabase = async () => {
  try {
    // Initialize the connection
    await dataSource.initialize();
    console.log('Database connection established');

    // Run the seeder directly
    const seeder = new ProdSeeder();
    await seeder.run(dataSource);

    console.log('Seeds executed successfully');
    
    // Close the connection
    await dataSource.destroy();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

// Run the seeds
seedDatabase(); 