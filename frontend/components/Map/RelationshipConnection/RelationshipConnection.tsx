import "./RelationshipConnection.css"
import { Relationship, RelationshipKind } from "@/lib/relaionshipInterfaces";
import { TreePerson } from "@/lib/treeInterfaces";
import { CSSProperties } from "react";

interface Props {
  relationship: Relationship;
  people: TreePerson[];
  draggedPerson: number | null;
  onClick: () => void;
}

export const relationshipLineDistance = 200;

export function RelationshipConnection({ relationship: rel, people, draggedPerson, onClick }: Props) {
  const partner1 = people.find((p) => p.id === rel.partner1)!;
  const partner2 = people.find((p) => p.id === rel.partner2)!;

  const clickmargin = 25;
  const posX = Math.min(partner1.x, partner2.x) - clickmargin;
  const posY = Math.min(partner1.y, partner2.y) - clickmargin;
  const width = Math.abs(partner1.x - partner2.x) + clickmargin + relationshipLineDistance;
  const height = Math.abs(partner1.y - partner2.y) + clickmargin + relationshipLineDistance;
  
  const viewBox = `${posX + clickmargin / 2} ${posY + clickmargin / 2} ${width} ${height}`;
  const opacity = (rel.partner1 === draggedPerson || rel.partner2 === draggedPerson) ? 0 : 1;
  const strokeDasharray = rel.kind === RelationshipKind.UNFORMAL ?
    "5px" : rel.kind === RelationshipKind.ENGAGEMENT ?
    "20px 6px" : "none";
  const style: CSSProperties = {
    translate: `${posX + width / 2}px ${posY + height / 2}px`,
    opacity,
    strokeDasharray,
    width,
    height
  };

  const midX = (partner1.x + partner2.x) / 2;
  const conLineY = Math.max(partner1.y, partner2.y) + relationshipLineDistance;

  const relSymbol = rel.kind === RelationshipKind.SEPARATION ?
    <>
      <circle className="rel-symbol rel-line" cx={midX} cy={conLineY} />
      <line className='rel-line' x1={midX - 6} y1={conLineY + 6} x2={midX + 6} y2={conLineY - 6} />
    </> : rel.kind === RelationshipKind.DIVORCE ?
    <>
      <circle className="rel-symbol rel-line" cx={midX} cy={conLineY} />
      <line className='rel-line' x1={midX - 6} y1={conLineY - 6} x2={midX + 6} y2={conLineY + 6} />
      <line className='rel-line' x1={midX - 6} y1={conLineY + 6} x2={midX + 6} y2={conLineY - 6} />
    </>
    : <></>;

  return (
    <svg viewBox={viewBox} style={style} className='rel-connection' xmlns="http://www.w3.org/2000/svg">
      {/* Click margin lines */}
      <line className='rel-margin' strokeWidth={clickmargin} onClick={onClick} x1={partner1.x} y1={partner1.y} x2={partner1.x} y2={conLineY} />
      <line className='rel-margin' strokeWidth={clickmargin} onClick={onClick} x1={partner1.x} y1={conLineY} x2={partner2.x} y2={conLineY} />
      <line className='rel-margin' strokeWidth={clickmargin} onClick={onClick} x1={partner2.x} y1={conLineY} x2={partner2.x} y2={partner2.y} />
      {/* Visible lines */}
      <line className='rel-line' x1={partner1.x} y1={partner1.y} x2={partner1.x} y2={conLineY} />
      <line className='rel-line' x1={partner1.x} y1={conLineY} x2={partner2.x} y2={conLineY} />
      <line className='rel-line' x1={partner2.x} y1={conLineY} x2={partner2.x} y2={partner2.y} />
      {relSymbol}
    </svg>
  );
}