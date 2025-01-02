import { Parenthood } from "./parenthoodInterfaces";

const PARENTHOOD_STORAGE_KEY = "parenthoods";

function getParenthoodsFromStorage(): Parenthood[] {
  if (typeof window === "undefined") return [];
  const parenthoods = localStorage.getItem(PARENTHOOD_STORAGE_KEY);
  return parenthoods ? JSON.parse(parenthoods) : [];
}

function saveParenthoodsToStorage(parenthoods: Parenthood[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PARENTHOOD_STORAGE_KEY, JSON.stringify(parenthoods));
}

export async function getParenthood(id: number): Promise<Parenthood | null> {
  const parenthoods = getParenthoodsFromStorage();
  return parenthoods.find(p => p.child === id) || null;
}

export async function getAllParenthoods(): Promise<Parenthood[]> {
  return getParenthoodsFromStorage();
}

export async function saveParenthood(parenthood: Parenthood): Promise<void> {
  const parenthoods = getParenthoodsFromStorage();
  const index = parenthoods.findIndex(p => p.child === parenthood.child);
  if (index >= 0) {
    parenthoods[index] = parenthood;
  } else {
    parenthoods.push(parenthood);
  }
  saveParenthoodsToStorage(parenthoods);
}

export async function deleteParenthood(id: number): Promise<void> {
  let parenthoods = getParenthoodsFromStorage();
  parenthoods = parenthoods.filter(p => p.child !== id);
  saveParenthoodsToStorage(parenthoods);
}
