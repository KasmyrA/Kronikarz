"use client";
import './Map.css'
import { CSSProperties, forwardRef, useEffect, useImperativeHandle, useReducer, useRef, useState } from 'react';
import { PersonCard } from './PersonCard';
import { limitValue, onNextResize, scrollToMiddle } from '@/lib/utils';
import { Position, TreePerson } from '@/lib/treeInterfaces';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Relationship } from '@/lib/relaionshipInterfaces';
import { Parenthood } from '@/lib/parenthoodInterfaces';
import { RelationshipConnection } from '@/components/Map/RelationshipConnection/RelationshipConnection';
import { ParenthoodConnection } from '@/components/Map/ParenthoodConnection/ParenthoodConnection';

const scaleStep = 0.05;
const scaleMin = 0.5;
const scaleMax = 1.5;

export type HighlightData = { [personId: number]: string };

interface Props {
  people: TreePerson[];
  relationships: Relationship[];
  parenthoods: Parenthood[];
  peopleHighlights: HighlightData;
  onPersonClick: (p: TreePerson) => void;
  onPersonDrop: (pos: Position, pers: TreePerson) => void;
  onRelationshipClick: (r: number) => void
}

export interface MapHandle {
  getViewMiddlePosition: () => Position;
}

export const Map = forwardRef<MapHandle, Props>(function Map ({ people, peopleHighlights, relationships, parenthoods, onPersonClick, onPersonDrop, onRelationshipClick }, ref) {
  const [mapSize, setMapSize] = useState({
    width: Math.max(...people.map(p => Math.abs(p.position.x)), 0),
    height: Math.max(...people.map(p => Math.abs(p.position.y)), 0)
  });
  const [scale, setScale] = useReducer((oldScale: number, getNewScale: (old: number) => number) => {
    return limitValue(getNewScale(oldScale), scaleMin, scaleMax);
  }, 1);
  const oldScale = useRef(scale);
  const mapRef = useRef<HTMLDivElement>(null);
  const getMapContainer = () => mapRef.current!.parentElement!.parentElement!;
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPerson, setDraggedPerson] = useState<number | null>(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const scrollPosition = useRef({ left: 0, top: 0 });

  // Runs after component has mounted
  useEffect(() => {
    scrollToMiddle(mapRef.current!);

    getMapContainer().addEventListener('wheel', (e: any) => {
      e.preventDefault();
      setScale(scale => scale + scaleStep * Math.sign(e.wheelDeltaY))
    });
  }, [])

  // Runs when scale changes
  useEffect(() => {
    if (scale == oldScale.current) return;
    const mapContainer = getMapContainer();
    onNextResize(mapContainer, () => {
      mapContainer.scrollTop *= scale / oldScale.current;
      mapContainer.scrollLeft *= scale / oldScale.current;
      mapContainer.scrollTop += ((1 / oldScale.current) - (1 / scale)) * mapContainer.clientHeight * scale / 2;
      mapContainer.scrollLeft += ((1 / oldScale.current) - (1 / scale)) * mapContainer.clientWidth * scale / 2;
      oldScale.current = scale;
    });
  }, [scale])

  useImperativeHandle(ref, () => {
    return {
      getViewMiddlePosition: (): Position => {
        const map = mapRef.current!;
        const mapContainer = getMapContainer();
        const mapSize = map.getBoundingClientRect();
        return {
          x: (mapContainer.scrollLeft + (mapContainer.clientWidth - mapSize.width) / 2) / scale,
          y: (mapContainer.scrollTop + (mapContainer.clientHeight - mapSize.height) / 2) / scale,
        };
      }
    }
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging when clicking on person card
    if(e.target !== e.currentTarget) return;
    setIsDragging(true);
    startPosition.current = { x: e.clientX, y: e.clientY };
    const mapContainer = getMapContainer();
    scrollPosition.current = { left: mapContainer.scrollLeft, top: mapContainer.scrollTop };
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const mapContainer = getMapContainer();
    mapContainer.scrollLeft = scrollPosition.current.left - (e.clientX - startPosition.current.x);
    mapContainer.scrollTop = scrollPosition.current.top - (e.clientY - startPosition.current.y);
  }
  
  const handleMauseUp = () => {
    setIsDragging(false);
  }

  const peopleCards = people.map((person) => {
    const handleClick = () => onPersonClick(person);
    const handleDragStart = () => setDraggedPerson(person.id);
    const handleDrop = (position: Position) => {
      onPersonDrop(position, person);
      setDraggedPerson(null);

      // Increase size of map if needed
      const positionX = Math.abs(position.x);
      const positionY = Math.abs(position.y)
      if (mapSize.width > positionX && mapSize.height > positionY) {
        return
      }

      const newMapSize = {
        width: Math.max(mapSize.width, positionX),
        height: Math.max(mapSize.height, positionY)
      };
      
      // Adjust scroll after container size has changed
      const mapContainer = getMapContainer();
      onNextResize(mapContainer, () => {
        mapContainer.scrollTop += (newMapSize.height - mapSize.height) * scale;
        mapContainer.scrollLeft += (newMapSize.width - mapSize.width) * scale;
      });

      setMapSize(newMapSize);
    }

    return (
      <PersonCard
        person={person}
        highlight={peopleHighlights[person.id]}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        key={person.id}
        scale={scale}
      />
    )
  });

  const relationshipConnections = relationships.map((rel) => {
    return (
      <RelationshipConnection
        key={rel.id}
        relationship={rel}
        people={people}
        draggedPerson={draggedPerson}
        onClick={() => onRelationshipClick(rel.id)}
      />
    )
  });

  const parenthoodConnections = parenthoods.map((parenthood) => {
    return (
      <ParenthoodConnection
        key={parenthood.id}
        parenthood={parenthood}
        people={people}
        draggedPerson={draggedPerson}
      />
    )
  });

  const mapStyleVariables = {
    '--map-width': `calc(${mapSize.width * 2}px + 300vw)`,
    '--map-height': `calc(${mapSize.height * 2}px + 300vh)`,
    '--map-scale': `${scale}`
  } as CSSProperties;

	return (
    <ScrollArea className="map-container" type="always">
      <div
        className="map"
        style={mapStyleVariables}
        ref={mapRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMauseUp}
        onMouseLeave={()=>setIsDragging(false)}
      >
        {relationshipConnections}
        {parenthoodConnections}
        {peopleCards}
      </div>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
	)
});