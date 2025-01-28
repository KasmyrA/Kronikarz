"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/authActions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ErrorMessage } from "@/components/ui/ErrorMessage"

export function LoginCard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginClick = async () => {
    setError("")

    if (!username || !password) {
      setError("Aby się zalogować, musisz podać nazwę użytkownika i hasło")
      return
    }

    try {
      const user = await login(username, password)
      if (!user) {
        setError("Nie udało się zalogować. Sprawdź, czy podane dane są prawidłowe")
      }
      else if (!("id" in user)) {
        if (typeof user === 'string') {
          if (user.includes("credentials")) {
            setError("Nieprawidłowa nazwa użytkownika lub hasło. Spróbuj ponownie")
          } else {
            setError("Przepraszamy, wystąpił problem z logowaniem. Spróbuj ponownie za chwilę")
          }
        } else {
          setError("Przepraszamy, coś poszło nie tak. Spróbuj ponownie później")
        }
      }
      else {
        router.replace("/tree")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Przepraszamy, wystąpił nieoczekiwany problem. Spróbuj ponownie za chwilę")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zaloguj</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="username">Nazwa użytkownika</Label>
          <Input 
            id="username" 
            placeholder="Podaj nazwę użytkownika" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Hasło</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Podaj hasło" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <ErrorMessage message={error} />}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleLoginClick}>Zaloguj</Button>
      </CardFooter>
    </Card>
  )
}