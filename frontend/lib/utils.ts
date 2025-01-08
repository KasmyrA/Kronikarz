import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { RelationshipKind } from "./relaionshipInterfaces";
import { TreePerson } from "./treeInterfaces";
import { ParenthoodType } from "./parenthoodInterfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToMiddle(e: HTMLElement) {
  e.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
}

export function limitValue(v: number, min: number, max: number) {
  if (v < min) {
    return min;
  }

  if (v > max) {
    return max;
  }

  return v;
}

export function onNextResize(element: HTMLElement, callback: () => void) {
  const observer = new ResizeObserver(() => {
    callback()
    observer.disconnect();
  });
  observer.observe(element);
}

export function isImageFile(fileName: string) {
  const fileExtension = fileName.split(".").at(-1)!;
  return ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
}

export const relationshipKindToString: { [rk in RelationshipKind]: string } = {
  "divorce": "Rozwiedzeni",
  "engagement": "Zaręczeni",
  "marriage": "W małżeństwie",
  "separation": "W separacji",
  "unformal": "W związku nieformalnym"
}

export const parenthoodTypeToString: { [pt in ParenthoodType]: string } = {
  "biological": "Biologiczne",
  "adoptive": "Adopcyjne"
}

export function getNameSurname(person: TreePerson) {
  return (person.name || person.surname) ?
    `${person.name ?? ''} ${person.surname ?? ''}` :
    person.sex === 'F' ?
      'Nieznana' :
      'Nieznany';
}