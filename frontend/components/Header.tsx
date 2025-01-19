import { logout } from "@/lib/authActions";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  isLoggedIn: boolean;
}

export function Header({ isLoggedIn }: Props) {
  const router = useRouter();
  const handleLogoutClick = async () => {
    await logout();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full h-14 flex items-center px-8">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen />
          <span className="text-2xl font-semibold tracking-tight">
            Kronikarz
          </span>
        </Link>
        <div className="flex flex-1 md:justify-end">
          { isLoggedIn ? 
            <p className="cursor-pointer" onClick={handleLogoutClick}>Wyloguj</p> :
            <Link href="/auth">Zaloguj / Zarejestruj</Link> }
        </div>
      </div>
    </header>
  )
}