// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "route_optimizer",
  connectionLimit: 10, // Maximum number of connections in the pool
  waitForConnections: true, // Whether to wait for a connection to become available
  queueLimit: 0, // Maximum number of connection requests the pool will queue
}
