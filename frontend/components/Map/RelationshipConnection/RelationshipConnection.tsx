import "./RelationshipConnection.css"
import { Relationship } from "@/lib/relaionshipInterfaces";
import { TreePerson } from "@/lib/treeInterfaces";
import { CSSProperties } from "react";

interface Props {
  relationship: Relationship;
  people: TreePerson[];
  draggedPerson: number | null;
  onClick: () => void;
}

export function RelationshipConnection({ relationship: rel, people, draggedPerson, onClick }: Props) {
  const partner1 = people.find((p) => p.id === rel.partner1)!;
  const partner2 = people.find((p) => p.id === rel.partner2)!;

  const clickmargin = 15;
  const posX = Math.min(partner1.position.x, partner2.position.x) - clickmargin;
  const posY = Math.min(partner1.position.y, partner2.position.y) - clickmargin;
  const width = Math.abs(partner1.position.x - partner2.position.x) + clickmargin;
  const height = Math.abs(partner1.position.y - partner2.position.y) + clickmargin;
  
  const viewBox = `${posX + clickmargin / 2} ${posY + clickmargin / 2} ${width} ${height}`;
  const style: CSSProperties = {
    translate: `${posX + width / 2}px ${posY + height / 2}px`,
    opacity: (rel.partner1 === draggedPerson || rel.partner2 === draggedPerson) ? 0 : 1,
    width,
    height
  };

  const midX = partner1.position.x + ((partner2.position.x - partner1.position.x) / 2);
  const clickStrokeWidth = `${clickmargin}px`;

  return (
    <svg viewBox={viewBox} style={style} className='rel-connection' xmlns="http://www.w3.org/2000/svg">
      {/* Click margin lines */}
      <line className='rel-margin' strokeWidth={clickStrokeWidth} onClick={onClick} x1={partner1.position.x} y1={partner1.position.y} x2={midX} y2={partner1.position.y} />
      <line className='rel-margin' strokeWidth={clickStrokeWidth} onClick={onClick} x1={midX} y1={partner1.position.y} x2={midX} y2={partner2.position.y} />
      <line className='rel-margin' strokeWidth={clickStrokeWidth} onClick={onClick} x1={midX} y1={partner2.position.y} x2={partner2.position.x} y2={partner2.position.y} />
      {/* Visible lines */}
      <line className='rel-line' x1={partner1.position.x} y1={partner1.position.y} x2={midX} y2={partner1.position.y} />
      <line className='rel-line' x1={midX} y1={partner1.position.y} x2={midX} y2={partner2.position.y} />
      <line className='rel-line' x1={midX} y1={partner2.position.y} x2={partner2.position.x} y2={partner2.position.y} />
    </svg>
  );
}