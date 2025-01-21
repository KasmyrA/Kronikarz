"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LoginCard } from "./LoginCard"
import { RegisterCard } from "./RegisterCard"
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser } from "@/lib/authActions";
import { Header } from "@/components/Header";

export default function Auth() {
  const router = useRouter();
  useEffect(() => {
    getCurrentUser().then((user) => !!user && ("id" in user) && router.replace('/tree'));
  }, [router])

  return (
    <>
    <Header isLoggedIn={false} />
    <main className="flex-1 flex center justify-center items-center">
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
    </main>
    <Footer />
    </>
  );
}
