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
import { ErrorMessage } from "@/components/ui/ErrorMessage"

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
    setError("")

    if (!email) {
      setError("Podaj swój adres email, aby odzyskiwanie konta po zapomnieniu hasła działało")
      return
    }
    if (!validateEmail(email)) {
      setError("Podany adres email wydaje się nieprawidłowy. Sprawdź, czy nie ma literówek")
      return
    }

    if (!validateUsername(username)) {
      setError("Nazwa użytkownika powinna mieć 3-20 znaków i może zawierać tylko litery i cyfry")
      return
    }

    if (!validatePassword(password1)) {
      setError("Hasło powinno mieć minimum 8 znaków i zawierać: wielką literę, małą literę oraz cyfrę")
      return
    }

    if (password1 !== password2) {
      setError("Podane hasła różnią się od siebie. Upewnij się, że wpisałeś to samo hasło dwa razy")
      return
    }

    try {
      const user = await register(email, username, password1)
      if (!user) {
        setError("Przepraszamy, nie udało się utworzyć konta. Spróbuj ponownie później")
      }
      else if (!("id" in user)) {
        if (typeof user === 'string') {
          if (user.includes("duplicate key")) {
            if (user.includes("username")) {
              setError("Ta nazwa użytkownika jest już zajęta. Wybierz inną nazwę")
            } else if (user.includes("email")) {
              setError("Ten email jest już zarejestrowany. Może chcesz się zalogować?")
            } else {
              setError("Podane dane są już używane przez inne konto")
            }
          } else {
            setError("Przepraszamy, wystąpił problem podczas rejestracji. Spróbuj ponownie za chwilę")
          }
        } else {
          setError("Przepraszamy, coś poszło nie tak. Spróbuj ponownie później")
        }
      }
      else {
        router.replace("/tree")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("Przepraszamy, wystąpił nieoczekiwany problem. Spróbuj ponownie za chwilę")
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
				{error && <ErrorMessage message={error} />}
			</CardContent>
			<CardFooter>
				<Button className="w-full" onClick={handleRegisterClick}>Zarejestruj</Button>
			</CardFooter>
		</Card>
	)
}