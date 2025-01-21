/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card";
import { TreePerson } from "@/lib/treeInterfaces";
import { cn, getNameSurname } from "@/lib/utils";
import { User } from "lucide-react";
import { CSSProperties, useRef, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";

interface Props {
  scale: number;
  person: TreePerson;
  highlight: string | undefined;
  onDragStart: () => void;
  onDrop: (x: number, y: number) => void;
  onClick: () => void;
}

export function PersonCard({ scale, person, highlight, onDrop, onClick, onDragStart }: Props) {
  const [isDragged, setIsDragged] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDrag: DraggableEventHandler = () => {
    setIsDragged(true);
    onDragStart();
  }

  const handleStop: DraggableEventHandler = (e, d) => {
    if (!isDragged) {
      onClick()
      return
    }
    onDrop(d.x, d.y);
    setIsDragged(false);
  }

  const personImage = person.image ? 
    <img src={person.image} alt="Person image" className="size-full object-cover"/> :
    <User className="w-full h-full" />;

  const birthDeathDate = (person.birthDate || person.deathDate) &&
    <p className="leading-7 text-center">
      {person.birthDate === "" ? '?' : person.birthDate} - {person.deathDate === "" ? '*' : person.deathDate}
    </p>;

  const cardStyleVariables = {
    "--highlight": highlight
  } as CSSProperties;

  const shadowStyle = highlight && "shadow-[var(--highlight)_0px_0px_25px_-5px]";
  
  return (
    <Draggable
      onDrag={handleDrag}
      onStop={handleStop}
      defaultPosition={{ x: person.x, y: person.y }}
      nodeRef={cardRef}
      scale={scale}
      bounds="parent"
    >
      <Card ref={cardRef} style={cardStyleVariables} className={cn("w-60 p-4 cursor-pointer absolute transition-shadow", shadowStyle)}>
        <div className="w-48 h-48 m-auto pointer-events-none">
          { personImage }
        </div>
        <h4 className="text-base font-semibold tracking-tight text-center">
          { getNameSurname(person) }
        </h4>
        { birthDeathDate }
      </Card>
    </Draggable>
  )
}