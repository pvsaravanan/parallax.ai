"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { getFirebaseAuth, signOut, type User } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = async () => {
    await signOut(getFirebaseAuth())
  }

  return { user, loading, logout }
}
