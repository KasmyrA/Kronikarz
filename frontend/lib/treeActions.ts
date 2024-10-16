import { personToTreePerson } from "./personActions";
import { Tree } from "./treeInterfaces";

export async function getTree(id: number): Promise<Tree> {
    return {
      id,
      name: "Test tree",
      people: JSON.parse(localStorage.getItem('people') ?? "[]").map(personToTreePerson),
      relationships: JSON.parse(localStorage.getItem('relations') ?? "[]"),
      parenthoods: JSON.parse(localStorage.getItem('people') ?? "[]")
    }
  }