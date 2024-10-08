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

export function RegisterCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Zarejestruj</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="space-y-1">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" placeholder="Podaj email" />
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">Hasło</Label>
					<Input id="password" type="password" placeholder="Podaj hasło" />
				</div>
				<div className="space-y-1">
					<Label htmlFor="repeatPassword">Powtórz hasło</Label>
					<Input id="repeatPassword" type="password" placeholder="Powtórz hasło" />
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full">Zarejestruj</Button>
			</CardFooter>
		</Card>
	)
}