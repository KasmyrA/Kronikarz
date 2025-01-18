import { personToTreePerson } from "./personActions";
import { Tree } from "./treeInterfaces";

export function getTree(id: number): Promise<Tree> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "Test tree",
        people: JSON.parse(localStorage.getItem('people') ?? "[]").map(personToTreePerson),
        relationships: JSON.parse(localStorage.getItem('relations') ?? "[]"),
        parenthoods: JSON.parse(localStorage.getItem('parenthoods') ?? "[]")
      });
    }, 1000);
  });
}