import mysql from "mysql2/promise"
import { dbConfig } from "./db-config"

// Create a connection pool
const pool = mysql.createPool(dbConfig)

// Test the database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Database connection successful")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Execute a query with parameters
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params)
    return results as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Get a single row
export async function getRow<T>(sql: string, params?: any[]): Promise<T | null> {
  try {
    const [rows] = await pool.execute(sql, params)
    const rowsArray = rows as T[]
    return rowsArray.length > 0 ? rowsArray[0] : null
  } catch (error) {
    console.error("Database getRow error:", error)
    throw error
  }
}

// Insert a record and return the inserted ID
export async function insert(table: string, data: Record<string, any>): Promise<number> {
  try {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => "?").join(", ")

    const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`
    const [result] = await pool.execute(sql, values)

    return (result as mysql.ResultSetHeader).insertId
  } catch (error) {
    console.error("Database insert error:", error)
    throw error
  }
}

// Update a record
export async function update(
  table: string,
  data: Record<string, any>,
  whereClause: string,
  whereParams: any[],
): Promise<number> {
  try {
    const keys = Object.keys(data)
    const values = Object.values(data)

    const setClause = keys.map((key) => `${key} = ?`).join(", ")
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`

    const [result] = await pool.execute(sql, [...values, ...whereParams])

    return (result as mysql.ResultSetHeader).affectedRows
  } catch (error) {
    console.error("Database update error:", error)
    throw error
  }
}

// Delete a record
export async function remove(table: string, whereClause: string, whereParams: any[]): Promise<number> {
  try {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`
    const [result] = await pool.execute(sql, whereParams)

    return (result as mysql.ResultSetHeader).affectedRows
  } catch (error) {
    console.error("Database delete error:", error)
    throw error
  }
}

// Transaction support
export async function transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// Close all connections in the pool
export async function closePool(): Promise<void> {
  await pool.end()
}
