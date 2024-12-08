/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card";
import { Position, TreePerson } from "@/lib/treeInterfaces";
import { getNameSurname } from "@/lib/utils";
import { User } from "lucide-react";
import { useRef, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";

interface Props {
  scale: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  person: TreePerson;
  onDrop: (p: Position) => void;
  onClick: () => void;
}

export function PersonCard({ scale, person, onDrop, onClick }: Props) {
  const [isDragged, setIsDragged] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDrag: DraggableEventHandler = () => {
    setIsDragged(true);
  }

  const handleStop: DraggableEventHandler = (e, d) => {
    if (!isDragged) {
      onClick()
      return
    }
    onDrop({ x: d.x, y: d.y })
    setIsDragged(false);
  }

  const personImage = person.imageUrl ? 
    <img src={person.imageUrl} alt="Person image" className="size-full object-cover"/> :
    <User className="w-full h-full" />;

  const birthDeathDate = (person.birthDate || person.deathDate) &&
    <p className="leading-7 text-center">
      {person.birthDate === "" ? '?' : person.birthDate} - {person.deathDate === "" ? '*' : person.deathDate}
    </p>;
  
  return (
    <Draggable
      onDrag={handleDrag}
      onStop={handleStop}
      defaultPosition={person.position}
      nodeRef={cardRef}
      scale={scale}
      bounds="parent"
    >
      <Card ref={cardRef} className="w-60 p-4 cursor-pointer absolute">
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