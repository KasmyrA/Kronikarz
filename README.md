# Kronikarz

Project for the 5th semester of Computer Science.

The goal of this project is to create an application that provides users with the best experience in describing people and the relationships between them. The app will allow users to create family trees, describe events, and write biographies. Key features include:

- Visualization of family trees
- Drag-and-drop functionality
- Adding multimedia attachments
- Handling various types of relationships between individuals
- Timeline of relationships
- Biographical information (profession, position, achievements, awards and everything else)
- Export to PDF
- Saving and reading data from JSON files
- Multi-user support and multiple family trees

## Authors

- [KasmyrA](https://github.com/KasmyrA)
- [Gojodzojo](https://github.com/Gojodzojo)
- [MFSTL1](https://github.com/MFSTL1)
- [Hipcio10](https://github.com/Hipcio10)

# Polski

Projekt na 5 semestr Informatyki

Celem tego projektu jest stworzenie aplikacji, która zapewni użytkownikom najlepsze doświadczenie w opisywaniu ludzi i relacji między nimi. Aplikacja pozwoli użytkownikom tworzyć drzewa genealogiczne, opisywać wydarzenia i pisać biografie. Kluczowe funkcje to:

- Wizualizacja drzew genealogicznych
- Funkcjonalność przeciągnij i upuść
- Dodawanie załączników multimedialnych
- Obsługa różnych typów relacji między osobami
- Oś czasu relacji
- Informacje biograficzne (zawód, stanowisko, osiągnięcia, nagrody i wszystko inne)
- Eksport do PDF
- Zapis i odczyt danych z plików JSON
- Obsługa wielu użytkowników i wielu drzew genealogicznych


# Dodawanie drzew

Aby dodać nowe drzewo w zapytaniu POST lub PUT podajemy dane wg. następującego schematu:

{
    "uid": 1,
    "name": "My Family Tree",
    "people": [1, 2, 3],
    "relationships": [1, 2],
    "parenthoods": [1]
}

Pola people, relationships i parenthoods są opcjonalne, nie trzeba ich od razu wypełniać przy tworzeniu drzewa.

Dodając nowe osoby, relacje, rodzicielstwa do drzewa najpierw wysyłamy zapytania POST wraz ze szczegółami danego obiektu, a następnie wysyłamy zapytanie PUT z drzewem, gdzie jedynie w odpowiedniej liście podajemy id nowoutworzonego obiektu (id przy tworzeniu zwraca nam serwer).
