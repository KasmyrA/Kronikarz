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

export function LoginCard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginClick = async () => {
    try {
      const user = await login(username, password);
      console.log(user)
      if (!user) {
        throw new Error()
      }
      else if (!("id" in user)) {
        setError(JSON.stringify(user));  
      }
      else {
        router.replace("/tree");
      }
    } catch (err) {
      setError(JSON.stringify(err));
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
          <Input id="username" placeholder="Podaj nazwę użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Hasło</Label>
          <Input id="password" type="password" placeholder="Podaj hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <p className="text-destructive">{error}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleLoginClick}>Zaloguj</Button>
      </CardFooter>
    </Card>
  )
}