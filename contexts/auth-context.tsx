"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "student" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  college: string
  phone?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  college: string
  phone?: string
  role?: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("marketplace-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("marketplace-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get stored users
    const storedUsers = JSON.parse(localStorage.getItem("marketplace-users") || "[]")
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("marketplace-user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: "Invalid email or password" }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get existing users
    const storedUsers = JSON.parse(localStorage.getItem("marketplace-users") || "[]")

    // Check if user already exists
    if (storedUsers.find((u: any) => u.email === userData.email)) {
      setIsLoading(false)
      return { success: false, error: "User with this email already exists" }
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      college: userData.college,
      phone: userData.phone,
      role: userData.role || "student",
      createdAt: new Date().toISOString(),
    }

    // Store user
    storedUsers.push(newUser)
    localStorage.setItem("marketplace-users", JSON.stringify(storedUsers))

    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("marketplace-user", JSON.stringify(userWithoutPassword))

    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("marketplace-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
