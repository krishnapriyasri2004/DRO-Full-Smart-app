import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();


// Function to test MySQL connection and run a query
async function testMySQLConnection() {
  // Connection configuration using environment variables
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootkp',
    database: process.env.DB_NAME || 'route_optimizer1'
  };

  console.log('Attempting to connect to MySQL database with the following config:');
  console.log(`Host: ${config.host}`);
  console.log(`Port: ${config.port}`);
  console.log(`User: ${config.user}`);
  console.log(`Database: ${config.database}`);
  
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL database!');
    
    // Test query - show tables
    console.log('\nFetching list of tables:');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tables.forEach((table, index) => {
        // The property name varies depending on the database
        const tableName = Object.values(table)[0];
        console.log(`${index + 1}. ${tableName}`);
      });
    }
    
    // If there are tables, query the first one to show some data
    if (tables.length > 0) {
      const firstTableName = Object.values(tables[0])[0];
      console.log(`\nFetching sample data from table '${firstTableName}':`);
      
      const [rows] = await connection.query(`SELECT * FROM ${firstTableName} LIMIT 5`);
      
      if (rows.length === 0) {
        console.log(`No data found in table '${firstTableName}'.`);
      } else {
        console.log(`Data from '${firstTableName}' (showing up to 5 rows):`);
        console.table(rows);
      }
    }
    
    // Query for Coimbatore-specific data if it exists
    try {
      console.log('\nLooking for Coimbatore-specific data:');
      const [coimbatoreAreas] = await connection.query('SELECT * FROM coimbatore_areas LIMIT 5');
      
      if (coimbatoreAreas.length > 0) {
        console.log('Found Coimbatore areas data:');
        console.table(coimbatoreAreas);
      } else {
        console.log('No Coimbatore areas data found. You may need to run the Coimbatore schema script.');
      }
    } catch (error) {
      console.log('Coimbatore areas table does not exist yet. You may need to run the Coimbatore schema script.');
    }
    
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nTip: Check your username and password.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nTip: Make sure MySQL server is running and accessible at the specified host and port.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\nTip: The specified database does not exist. You may need to create it first.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run the test function
testMySQLConnection();