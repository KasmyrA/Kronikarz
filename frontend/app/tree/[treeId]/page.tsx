"use client";
import { CSSProperties, useEffect, useRef, useState } from 'react';
import './page.css'
import { PersonCard, Position } from './PersonCard';
import { initialData } from './data';

interface Props {
  params: {
    treeId: string
  }
}

export default function Tree({ params }: Props) {
  const [data, setData] = useState(initialData);
  const [scale, setScale] = useState(1);
  const [mapSize, setMapSize] = useState({
    width: Math.max(...data.people.map(p => Math.abs(p.position.x))),
    height: Math.max(...data.people.map(p => Math.abs(p.position.y)))
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const scaleStep = 0.05;
  const scaleMin = 0.4;
  const scaleMax = 1.5;
  // console.log('rerender')
  console.log(scale)

  const scrollToMiddle = (e: HTMLElement) => {
    e.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }

  useEffect(() => {
    scrollToMiddle(mapRef.current!);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScroll = (e: any) => {
      e.preventDefault();
      setScale(scale => scale + scaleStep * Math.sign(e.wheelDeltaY))
    }

    const mapContainer = mapRef.current!.parentElement!;
    mapContainer.addEventListener('wheel', handleScroll);

    return () => {
      mapContainer.removeEventListener('wheel', handleScroll);
    }
  }, [])

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
      const mapContainer = mapRef.current!.parentElement!;
      const observer = new ResizeObserver(() => {
        mapContainer.scrollTop += (newMapSize.height - mapSize.height) * scale;
        mapContainer.scrollLeft += (newMapSize.width - mapSize.width) * scale;
        observer.disconnect();
      });
      observer.observe(mapContainer);

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
		<div className="map-container">
			<div className="map" style={mapStyleVariables} ref={mapRef}>
        {peopleCards}
      </div>
		</div>
	)
}