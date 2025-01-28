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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string) => {
    return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(username);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers;
  };

  const handleRegisterClick = async () => {
    setError("");

   

    if (!validateEmail(email)) {
      setError("Podany email jest nieprawidłowy");
      return;
    }

    if (!validateUsername(username)) {
      setError("Nazwa użytkownika musi mieć od 3 do 20 znaków i może zawierać tylko litery, cyfry, podkreślenia i myślniki");
      return;
    }

    
    if (!validatePassword(password1)) {
      setError("Hasło musi mieć co najmniej 8 znaków i zawierać wielką literę, małą literę oraz cyfrę");
      return;
    }
	
	if (password1 !== password2) {
		setError("Hasła nie są jednakowe");
		return;
	  }
  

	if (!email || !username || !password1 || !password2) {
		setError("Wszystkie pola muszą być wypełnione");
		return;
	  }

    try {
      const user = await register(email, username, password1);
      if (!user) {
        setError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.");
      }
      else if (!("id" in user)) {
        if (typeof user === 'string') {
          if (user.includes("duplicate key")) {
            if (user.includes("username")) {
              setError("Ta nazwa użytkownika jest już zajęta");
            } else if (user.includes("email")) {
              setError("Ten email jest już zarejestrowany");
            } else {
              setError("Podane dane są już zajęte");
            }
          } else {
            setError(`Błąd rejestracji: ${user}`);
          }
        } else {
          setError("Nieprawidłowa odpowiedź z serwera");
        }
      }
      else {
        router.replace("/tree");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
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