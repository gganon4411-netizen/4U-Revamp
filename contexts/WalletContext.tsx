"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { auth, type User } from "@/lib/api"

interface WalletContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const WalletContext = createContext<WalletContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  error: null,
})

export function useAuth() {
  return useContext(WalletContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, signMessage, disconnect } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("4u_session")
    if (token) {
      auth.me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("4u_session")
          setUser(null)
        })
    }
  }, [])

  const login = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setError("Wallet not connected")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const walletAddress = publicKey.toBase58()

      // 1. Get nonce from backend
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nonceData: any = await auth.getNonce(walletAddress)
      const nonce = nonceData.nonce
      // Use the backend's own message if it provides one, otherwise build from nonce
      const message = nonceData.message || `Sign this message to authenticate with 4U Marketplace.\n\nNonce: ${nonce}`

      // 2. Sign EXACTLY the message the backend gave us
      const encodedMessage = new TextEncoder().encode(message)
      const signatureBytes = await signMessage(encodedMessage)

      // Encode as base58 — standard Solana signature format expected by most backends
      // bs58 alphabet: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
      const bs58Encode = (bytes: Uint8Array): string => {
        const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        let num = BigInt(0)
        for (const byte of bytes) num = (num << BigInt(8)) + BigInt(byte)
        let encoded = ""
        while (num > BigInt(0)) {
          encoded = ALPHABET[Number(num % BigInt(58))] + encoded
          num = num / BigInt(58)
        }
        for (const byte of bytes) {
          if (byte !== 0) break
          encoded = "1" + encoded
        }
        return encoded
      }
      const signature = bs58Encode(signatureBytes)
      console.log("[4U] signing message:", message)
      console.log("[4U] signature (base58):", signature.slice(0, 20) + "...")

      // 3. Exchange signature for JWT — try both body shapes the backend might expect
      const { token, user: loggedInUser } = await auth.login(walletAddress, signature, message, nonce)

      localStorage.setItem("4u_session", token)
      setUser(loggedInUser)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, signMessage])

  const logout = useCallback(async () => {
    try {
      await auth.logout()
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem("4u_session")
    setUser(null)
    await disconnect()
  }, [disconnect])

  return (
    <WalletContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
