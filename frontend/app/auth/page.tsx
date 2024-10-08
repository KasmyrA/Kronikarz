import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LoginCard } from "./LoginCard"
import { RegisterCard } from "./RegisterCard"

export default function Auth() {
  return (
    <div className="flex-1 flex center justify-center items-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Zaloguj</TabsTrigger>
          <TabsTrigger value="register">Zarejestruj</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginCard />
        </TabsContent>
        <TabsContent value="register">
          <RegisterCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
  