"use client";
import './Map.css'
import { CSSProperties, useEffect, useReducer, useRef, useState } from 'react';
import { PersonCard } from './PersonCard';
import { limitValue, onNextResize, scrollToMiddle } from '@/lib/utils';
import { PersonDataDrawer } from '../../../components/PersonDataDrawer/PersonDataDrawer';
import { Position, Tree, TreePerson } from '@/lib/treeInterfaces';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createPerson, getTreePerson, updatePersonPosition } from '@/lib/personActions';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const scaleStep = 0.05;
const scaleMin = 0.5;
const scaleMax = 1.5;

interface Props {
  tree: Tree;
  setTree: (t: Tree) => void;
}

export function Map({ tree, setTree }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<TreePerson | null>(null);
  const [mapSize, setMapSize] = useState({
    width: Math.max(...tree.people.map(p => Math.abs(p.position.x)), 0),
    height: Math.max(...tree.people.map(p => Math.abs(p.position.y)), 0)
  });
  const [scale, setScale] = useReducer((oldScale: number, getNewScale: (old: number) => number) => {
    return limitValue(getNewScale(oldScale), scaleMin, scaleMax);
  }, 1);
  const oldScale = useRef(scale);
  const mapRef = useRef<HTMLDivElement>(null);
  const getMapContainer = () => mapRef.current!.parentElement!.parentElement!;
  const [isDragging, setIsDragging] = useState(false);
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

  const peopleCards = tree.people.map((person) => {
    const handleClick = () => setSelectedPerson(person);
    const handleDrop = (position: Position) => {
      person.position = position
      setTree({...tree})
      updatePersonPosition(person.id, position);

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

  const addPerson = async () => {
    const map = mapRef.current!;
    const mapContainer = getMapContainer();
    const mapSize = map.getBoundingClientRect();
    const newPerson = await createPerson({
      x: (mapContainer.scrollLeft + (mapContainer.clientWidth - mapSize.width) / 2) / scale,
      y: (mapContainer.scrollTop + (mapContainer.clientHeight - mapSize.height) / 2) / scale,
    });
    tree.people.push(newPerson);
    setTree({...tree});
  }

  const closePersonDrawer = async () => {
    const { id } = selectedPerson!;
    setSelectedPerson(null);
    const updatedPersonIndex = tree.people.findIndex((p) => p.id === id);
    const newPersonData = await getTreePerson(id);

    if (newPersonData) {
      tree.people[updatedPersonIndex] = newPersonData;
    } else {
      tree.people.splice(updatedPersonIndex, 1);
    }
    
    setTree({...tree});
  }

  const mapStyleVariables = {
    '--map-width': `calc(${mapSize.width * 2}px + 300vw)`,
    '--map-height': `calc(${mapSize.height * 2}px + 300vh)`,
    '--map-scale': `${scale}`
  } as CSSProperties;

	return (
    <>
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
        <Button onClick={addPerson} size="icon" className='absolute right-8 bottom-8'>
          <Plus className="h-4 w-4" />
        </Button>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <PersonDataDrawer closeDrawer={closePersonDrawer} person={selectedPerson} />
    </>
	)
}