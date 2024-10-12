import { Card } from "@/components/ui/card";
import { useRef, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";

export interface Position {
  x: number;
  y: number
}

interface Props {
  scale: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  person: any;
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

  return (
    <Draggable
      onDrag={handleDrag}
      onStop={handleStop}
      defaultPosition={person.position}
      nodeRef={cardRef}
      scale={scale}
      bounds="parent"
    >
      <Card ref={cardRef} className="w-40 p-4 cursor-pointer absolute">
        <img src={person.imageUrl} alt={person.names} className="m-auto aspect-square pointer-events-none"/>
        <h4 className="text-base font-semibold tracking-tight">
          {person.names} {person.surname}
        </h4>
        {person.birthDate && <p className="leading-7">
          {person.birthDate} - {person.deathDate ?? '*'}
        </p>}
      </Card>
    </Draggable>
  )
}