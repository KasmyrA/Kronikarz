/* eslint-disable @next/next/no-img-element */
"use client";
import { CenteredCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/authActions";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    getCurrentUser().then((user) => !!user && router.replace('/tree'));
  }, [router])

  return (
    <>
    <Header isLoggedIn={false} />
    <main className="w-full p-8 fade-in footer-padding">
      <h2 className="text-3xl font-bold slide-in">Kronikarz - zrozum realcje w zagmatwanym życiu</h2>
      <p className="slide-in">Opisz relacje rodzinne w przejrzysty i wygodny sposób</p>

      <div className="flex justify-center space-x-4 mt-10">
        <CenteredCard>
          <CardHeader>
            <CardTitle>Czysty i przejrzysty interfejs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nasza aplikacja oferuje intuicyjny interfejs, który ułatwia nawigację i zarządzanie relacjami rodzinnymi.</p>
          </CardContent>
        </CenteredCard>
        <CenteredCard>
          <CardHeader>
            <CardTitle>Wygodny i prosty w użyciu</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tworzenie i edytowanie relacji nigdy nie było prostsze dzięki naszym narzędziom zaprojektowanym z myślą o użytkowniku.</p>
          </CardContent>
        </CenteredCard>
        <CenteredCard>
          <CardHeader>
            <CardTitle>Nielimitowane możliwości</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nasza aplikacja pozwala na dodawanie nieograniczonej liczby relacji i szczegółów, aby dokładnie odwzorować Twoją rodzinę.</p>
          </CardContent>
        </CenteredCard>
      </div>
      <div className="flex justify-center space-x-4 mt-10">
        <CenteredCard>
          <CardHeader>
            <CardTitle>Wsparcie dla wielu użytkowników</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nasza platforma obsługuje wielu użytkowników, co pozwala na współpracę i dzielenie się informacjami w rodzinie.</p>
          </CardContent>
        </CenteredCard>
        <CenteredCard>
          <CardHeader>
            <CardTitle>Różnorodne typy relacji</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Jesteśmy przygotowani na wszystko - nasza aplikacja obsługuje różnorodne typy relacji, aby sprostać Twoim potrzebom.</p>
          </CardContent>
        </CenteredCard>
        <CenteredCard>
          <CardHeader>
            <CardTitle>Fenomenalny zespół studentów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <img src="https://github.com/KasmyrA.png" alt="Kacper Smyrak" className="w-12 h-12 rounded-full" />
              <img src="https://github.com/Gojodzojo.png" alt="Mateusz Goik" className="w-12 h-12 rounded-full" />
              <img src="https://github.com/MFSTL1.png" alt="MFSTL1" className="w-12 h-12 rounded-full" />
              <img src="https://github.com/Hipcio10.png" alt="Hipcio10" className="w-12 h-12 rounded-full" />
            </div>
          </CardContent>
        </CenteredCard>
      </div>

      <h2 className="text-2xl font-semibold mt-12">Krótka i ładna prezentacja funkcjonalności ze screenshotami</h2>
      <div className="flex justify-center space-x-4 mt-6">
        <img src="/screenshots/screenshot1.png" alt="Screenshot 1" className="w-1/3 rounded-lg shadow-lg" />
        <img src="/screenshots/screenshot2.png" alt="Screenshot 2" className="w-1/3 rounded-lg shadow-lg" />
        <img src="/screenshots/screenshot3.png" alt="Screenshot 3" className="w-1/3 rounded-lg shadow-lg" />
      </div>
    </main>
    <Footer />
    </>
  );
}
