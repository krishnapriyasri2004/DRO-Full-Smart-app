import { query, getRow, insert, update, remove } from "@/lib/db"

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  company_name?: string
  phone?: string
  role: "admin" | "manager" | "dispatcher" | "driver"
  created_at: Date
  updated_at: Date
}

export interface UserInput {
  name: string
  email: string
  password_hash: string
  company_name?: string
  phone?: string
  role?: "admin" | "manager" | "dispatcher" | "driver"
}

export async function getAllUsers(): Promise<User[]> {
  return query<User[]>("SELECT * FROM users ORDER BY name")
}

export async function getUserById(id: number): Promise<User | null> {
  return getRow<User>("SELECT * FROM users WHERE id = ?", [id])
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return getRow<User>("SELECT * FROM users WHERE email = ?", [email])
}

export async function createUser(userData: UserInput): Promise<number> {
  return insert("users", userData)
}

export async function updateUser(id: number, userData: Partial<UserInput>): Promise<number> {
  return update("users", userData, "id = ?", [id])
}

export async function deleteUser(id: number): Promise<number> {
  return remove("users", "id = ?", [id])
}
