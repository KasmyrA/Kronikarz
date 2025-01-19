import { personToTreePerson } from "./personActions";
import { Tree } from "./treeInterfaces";
import { User } from "./userInterfaces";

export function getTreeList(): Promise<Tree[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Test tree 1", parenthoods: [], people: [], relationships: [] },
        { id: 2, name: "Test tree 2", parenthoods: [], people: [], relationships: [] },
        { id: 3, name: "Test tree 3", parenthoods: [], people: [], relationships: [] },
      ]);
    }, 1000);
  });
}

export async function addTree(treeName: string): Promise<Tree> {
  return { id: 3, name: treeName, parenthoods: [], people: [], relationships: [] }
}

export async function deleteTree(treeId: number): Promise<void> {
  return
}

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