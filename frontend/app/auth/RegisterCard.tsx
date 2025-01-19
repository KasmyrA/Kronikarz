"use client"
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
import { register } from "@/lib/authActions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterCard() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleRegisterClick = async () => {
    try {
      const user = await register(email, username, password1);
      console.log(user)
      if (!user) {
        setError("Nieznany błąd logowania");
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
				<CardTitle>Zarejestruj</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="space-y-1">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" placeholder="Podaj email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="username">Nazwa użytkownika</Label>
					<Input id="username" placeholder="Podaj nazwę użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">Hasło</Label>
					<Input id="password" type="password" placeholder="Podaj hasło" value={password1} onChange={(e) => setPassword1(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label htmlFor="repeatPassword">Powtórz hasło</Label>
					<Input id="repeatPassword" type="password" placeholder="Powtórz hasło" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
				</div>
				<p className="text-destructive">{error}</p>
			</CardContent>
			<CardFooter>
				<Button className="w-full" onClick={handleRegisterClick}>Zarejestruj</Button>
			</CardFooter>
		</Card>
	)
}