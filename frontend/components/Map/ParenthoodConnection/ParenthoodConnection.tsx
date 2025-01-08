import "./ParenthoodConnection.css"
import { Parenthood } from "@/lib/parenthoodInterfaces";
import { TreePerson } from "@/lib/treeInterfaces";
import { CSSProperties } from "react";

interface Props {
  parenthood: Parenthood;
  people: TreePerson[];
  draggedPerson: number | null;
}

export function ParenthoodConnection({ parenthood, people, draggedPerson }: Props) {
  const mother = parenthood.mother ? people.find((p) => p.id === parenthood.mother) : null;
  const father = parenthood.father ? people.find((p) => p.id === parenthood.father) : null;
  const child = people.find((p) => p.id === parenthood.child);

  if (!child) return null;

  const clickmargin = 25;
  const posX = Math.min(mother?.position.x ?? Infinity, father?.position.x ?? Infinity, child.position.x) - clickmargin;
  const posY = Math.min(mother?.position.y ?? Infinity, father?.position.y ?? Infinity, child.position.y) - clickmargin;
  const width = Math.max(mother?.position.x ?? -Infinity, father?.position.x ?? -Infinity, child.position.x) - posX + clickmargin;
  const height = Math.max(mother?.position.y ?? -Infinity, father?.position.y ?? -Infinity, child.position.y) - posY + clickmargin;

  const viewBox = `${posX + clickmargin / 2} ${posY + clickmargin / 2} ${width} ${height}`;
  const opacity = (parenthood.mother === draggedPerson || parenthood.father === draggedPerson || parenthood.child === draggedPerson) ? 0 : 1;
  const style: CSSProperties = {
    translate: `${posX + width / 2}px ${posY + height / 2}px`,
    opacity,
    width,
    height
  };

  return (
    <svg viewBox={viewBox} style={style} className='parenthood-connection' xmlns="http://www.w3.org/2000/svg">
      {/* Click margin lines */}
      {mother && <line className='parenthood-margin' strokeWidth={clickmargin} x1={mother.position.x} y1={mother.position.y} x2={child.position.x} y2={child.position.y} />}
      {father && <line className='parenthood-margin' strokeWidth={clickmargin} x1={father.position.x} y1={father.position.y} x2={child.position.x} y2={child.position.y} />}
      {/* Visible lines */}
      {mother && <line className='parenthood-line' x1={mother.position.x} y1={mother.position.y} x2={child.position.x} y2={child.position.y} />}
      {father && <line className='parenthood-line' x1={father.position.x} y1={father.position.y} x2={child.position.x} y2={child.position.y} />}
    </svg>
  );
}
