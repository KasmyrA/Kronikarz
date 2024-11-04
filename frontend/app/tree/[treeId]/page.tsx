"use client";
import './page.css'
import { CSSProperties, useEffect, useReducer, useRef, useState } from 'react';
import { PersonCard, Position } from './PersonCard';
import { initialData } from './data';
import { limitValue, onNextResize, scrollToMiddle } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const scaleStep = 0.05;
const scaleMin = 0.5;
const scaleMax = 1.5;

interface Props {
  params: {
    treeId: string
  }
}

export default function Tree({ params }: Props) {
  const [data, setData] = useState(initialData);
  const [mapSize, setMapSize] = useState({
    width: Math.max(...data.people.map(p => Math.abs(p.position.x))),
    height: Math.max(...data.people.map(p => Math.abs(p.position.y)))
  });
  const [scale, setScale] = useReducer((oldScale: number, getNewScale: (old: number) => number) => {
    return limitValue(getNewScale(oldScale), scaleMin, scaleMax);
  }, 1);
  const oldScale = useRef(scale);
  const mapRef = useRef<HTMLDivElement>(null);
  const getMapContainer = () => mapRef.current!.parentElement!.parentElement!;

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
      mapContainer.scrollLeft += ((1 / oldScale.current) - (1 / scale)) * mapContainer.offsetWidth * scale / 2;
      oldScale.current = scale;
    });
  }, [scale])
  // Dragging
  const [isDragging, setIsDragging] = useState(false);
  
  const startPosition = useRef({ x: 0, y: 0 });
  const scrollPosition = useRef({ left: 0, top: 0 });

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

  const peopleCards = data.people.map((person) => {
    const handleClick = () => console.log('click');
    const handleDrop = (position: Position) => {
      person.position = position
      setData({...data})

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
        onClick={handleClick}
        onDrop={handleDrop}
        key={person.id}
        scale={scale}
      />
    )
  })

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
        {peopleCards}
      </div>
      <ScrollBar orientation="vertical" className="map-scrollbar" />
      <ScrollBar orientation="horizontal" className="map-scrollbar" />
		</ScrollArea>
	)
}