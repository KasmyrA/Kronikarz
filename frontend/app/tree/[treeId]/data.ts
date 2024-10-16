import { Tree } from "@/lib/treeInterfaces";


export const initialData: Tree = {
  id: 1,
  name: "Test tree",
  people: [
    {
      id: 0,
      name: "Magdalena",
      surname: "Goik",
      imageUrl: "https://scontent.fktw1-1.fna.fbcdn.net/v/t39.30808-1/428480025_1693029991226029_8830892298463305124_n.jpg?stp=dst-jpg_s200x200&_nc_cat=101&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=spmCcrarjVEQ7kNvgHITjTo&_nc_ht=scontent.fktw1-1.fna&_nc_gid=A3GL4znP94Ha3ODLyUhH2gj&oh=00_AYDL9YyJAbAUoxQA5tPy4a5xBNJpY_j44odSOdyaVIqtUA&oe=67109A97",
      birthDate: "2003.11.21",
      deathDate: null,
      position: { x: 10, y: 10 }
    },
    {
      id: 1,
      name: "Mateusz",
      surname: "Goik",
      imageUrl: "https://scontent.fktw4-1.fna.fbcdn.net/v/t39.30808-6/462754419_2462706180591056_213478908349592643_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=xGoZ7t9oNfQQ7kNvgHT0ZY6&_nc_ht=scontent.fktw4-1.fna&_nc_gid=A93E634Dt2c3xU2l4N0hDv-&oh=00_AYBjofSfpIB_Wq3XKmr1wmIHsclEwNku8fys6_dKuiFAXA&oe=671096D5",
      birthDate: "2003.06.06",
      deathDate: null,
      position: { x: -10, y: -10 }
    }
  ],
  relationships: [
    {
      id: 0,
      parrner1: 0,
      partner2: 1,
      kind: "engagement"   // Ostatni z typów relacji
    }
  ],
  parenthood: [
    {
      mother: 10, // Id osoby, null jeśli nieznana
      father: 20,
      child: 25,
      adoption: {   // null jeśli brak adopcji
        mother: 30,
        father: 40,
        date: "2000.1.1"
      }
    }
  ]
};