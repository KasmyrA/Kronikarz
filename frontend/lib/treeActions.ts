import { personToTreePerson } from "./personActions";
import { relationshipToTreeRelationship } from "./relationshipActions";
import { Tree } from "./treeInterfaces";

export function getTree(id: number): Promise<Tree> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "Test tree",
        people: JSON.parse(localStorage.getItem('people') ?? "[]").map(personToTreePerson),
        relationships: JSON.parse(localStorage.getItem('relations') ?? "[]").map(relationshipToTreeRelationship),
        parenthoods: JSON.parse(localStorage.getItem('people') ?? "[]")
      });
    }, 1000);
  });
}