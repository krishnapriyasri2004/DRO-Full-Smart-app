import fs from "fs"
import path from "path"
import mysql from "mysql2/promise"
import { dbConfig } from "./db-config"

async function initializeDatabase() {
  let connection: mysql.Connection | null = null

  try {
    // First connect without specifying a database
    const config = { ...dbConfig }
    delete config.database

    connection = await mysql.createConnection(config)

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`)
    console.log(`Database ${dbConfig.database} created or already exists`)

    // Switch to the database
    await connection.query(`USE ${dbConfig.database}`)

    // Read and execute the schema SQL file
    const schemaPath = path.join(process.cwd(), "db", "schema.sql")
    const schemaSql = fs.readFileSync(schemaPath, "utf8")

    // Split the SQL file into individual statements
    const statements = schemaSql
      .split(";")
      .filter((statement) => statement.trim() !== "")
      .map((statement) => statement.trim() + ";")

    // Execute each statement
    for (const statement of statements) {
      await connection.query(statement)
    }

    console.log("Database schema initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("Database initialization completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Database initialization failed:", error)
      process.exit(1)
    })
}

export default initializeDatabase
