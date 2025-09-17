export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

// Mock user database (in real app, this would be in a database)
const USERS_KEY = "herbalif_users"
const CURRENT_USER_KEY = "herbalif_current_user"

export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function login(credentials: LoginCredentials): Promise<User> {
  return new Promise((resolve, reject) => {
    const users = getUsers()
    const user = users.find((u) => u.email === credentials.email)

    if (!user) {
      reject(new Error("Email tidak ditemukan"))
      return
    }

    // In real app, you'd hash and compare passwords
    // For demo purposes, we'll use simple comparison
    if (credentials.password === "password123") {
      setCurrentUser(user)
      resolve(user)
    } else {
      reject(new Error("Password salah"))
    }
  })
}

export function register(credentials: RegisterCredentials): Promise<User> {
  return new Promise((resolve, reject) => {
    const users = getUsers()

    if (users.find((u) => u.email === credentials.email)) {
      reject(new Error("Email sudah terdaftar"))
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
    }

    users.push(newUser)
    saveUsers(users)
    setCurrentUser(newUser)
    resolve(newUser)
  })
}

export function logout(): void {
  setCurrentUser(null)
}
