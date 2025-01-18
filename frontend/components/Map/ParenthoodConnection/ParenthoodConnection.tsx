import "./ParenthoodConnection.css"
import { Parenthood, ParenthoodKind } from "@/lib/parenthoodInterfaces";
import { TreePerson } from "@/lib/treeInterfaces";
import { CSSProperties } from "react";
import { relationshipLineDistance } from "../RelationshipConnection/RelationshipConnection";

interface Props {
  parenthood: Parenthood;
  people: TreePerson[];
  draggedPerson: number | null;
  onClick: () => void;
}

export function ParenthoodConnection({ parenthood, people, draggedPerson, onClick }: Props) {
  const mother = people.find((p) => p.id === parenthood.mother);
  const father = people.find((p) => p.id === parenthood.father);
  const child = people.find((p) => p.id === parenthood.child);

  if (!father || !mother || !child) return null;

  const clickmargin = 25;
  const relationshipLineY = Math.max(mother.position.y, father.position.y) + relationshipLineDistance;
  const closerParentX = Math.abs(mother.position.x - child.position.x) < Math.abs(father.position.x - child.position.x) ?
    mother.position.x : father.position.x;
  const posX = Math.min(child.position.x, closerParentX) - clickmargin;
  const posY = Math.min(child.position.y, relationshipLineY) - clickmargin;
  const width = Math.max(child.position.x, closerParentX) - posX + clickmargin;
  const height = Math.max(child.position.y, relationshipLineY) - posY + clickmargin;

  const viewBox = `${posX + clickmargin / 2} ${posY + clickmargin / 2} ${width} ${height}`;
  const opacity = (parenthood.mother === draggedPerson || parenthood.father === draggedPerson || parenthood.child === draggedPerson) ? 0 : 1;
  const strokeDasharray = parenthood.type === ParenthoodKind.ADOPTIVE ?
    "5px" :
    "none";
  const style: CSSProperties = {
    translate: `${posX + width / 2}px ${posY + height / 2}px`,
    opacity,
    width,
    height,
    strokeDasharray
  };

  const childIsNotBetweenParents = child.position.x < Math.min(mother.position.x, father.position.x) || child.position.x > Math.max(mother.position.x, father.position.x);
  
  return (
    <svg viewBox={viewBox} style={style} className='parenthood-connection' xmlns="http://www.w3.org/2000/svg">
      {/* Click margin lines */}
      <line className='parenthood-margin' strokeWidth={clickmargin} onClick={onClick} x1={child.position.x} y1={child.position.y} x2={child.position.x} y2={relationshipLineY} />
      {childIsNotBetweenParents && <line className='parenthood-margin' strokeWidth={clickmargin} onClick={onClick} x1={closerParentX} y1={relationshipLineY} x2={child.position.x} y2={relationshipLineY} />}
      {/* Visible lines */}
      <line className='parenthood-line' x1={child.position.x} y1={child.position.y} x2={child.position.x} y2={relationshipLineY} />
      {childIsNotBetweenParents && <line className='parenthood-line' x1={closerParentX} y1={relationshipLineY} x2={child.position.x} y2={relationshipLineY} />}
    </svg>
  );
}
