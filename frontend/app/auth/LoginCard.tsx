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

export function LoginCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zaloguj</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Podaj email" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Hasło</Label>
          <Input id="password" placeholder="Podaj hasło" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Zaloguj</Button>
      </CardFooter>
    </Card>
  )
}