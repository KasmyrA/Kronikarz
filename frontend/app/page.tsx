import { CenteredCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="w-full p-8 fade-in">
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
      </div>

      <h2>krótka i ładna prezentacja funkcjonalności ze skreenshotami</h2>
      <footer className="mt-10 p-4 bg-gray-800 text-white text-center">
        <p>&copy; 2025 Kronikarz. Wszelkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}
