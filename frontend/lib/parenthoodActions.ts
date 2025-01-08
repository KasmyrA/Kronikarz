import { Parenthood } from "./parenthoodInterfaces";

function getUniqueId<T extends { id: number }>(arr: T[]) {
  let id: number;
  do {
    id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
  } while (arr.some(t => t.id === id));
  return id;
}

export function createParenthood(parenthood: Omit<Parenthood, "id">): Promise<Parenthood> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const parenthoods: Parenthood[] = JSON.parse(localStorage.getItem('parenthoods') ?? "[]");
      const newParenthood: Parenthood = {
        ...parenthood,
        id: getUniqueId(parenthoods),
      };
      parenthoods.push(newParenthood)
      localStorage.setItem('parenthoods', JSON.stringify(parenthoods));
      resolve(newParenthood);
    }, 1000);
  });
}

export function getParenthood(parenthoodId: number): Promise<Parenthood | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const parenthoods: Parenthood[] = JSON.parse(localStorage.getItem('parenthoods') ?? "[]");
      resolve(parenthoods.find(r => r.id === parenthoodId));
    }, 1000);
  });
}

export function updateParenthood(parenthood: Parenthood): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const parenthoods: Parenthood[] = JSON.parse(localStorage.getItem('parenthoods') ?? "[]");
      const i = parenthoods.findIndex(p => p.id === parenthood.id);
      parenthoods[i] = parenthood;
      localStorage.setItem('parenthoods', JSON.stringify(parenthoods));
      resolve();
    }, 1000);
  });
}

export function deleteParenthood(parenthoodId: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const parenthoods: Parenthood[] = JSON.parse(localStorage.getItem('parenthoods') ?? "[]");
      const i = parenthoods.findIndex(p => p.id === parenthoodId);
      parenthoods.splice(i, 1);
      localStorage.setItem('parenthoods', JSON.stringify(parenthoods));
      resolve();
    }, 1000);
  });
}