"use client";
import { Position, Tree, TreePerson } from '@/lib/treeInterfaces';
import { getTree } from '@/lib/treeActions';
import { HighlightData, Map, MapHandle } from '../../../components/Map/Map';
import { useEffect, useRef, useState } from 'react';
import { Heart, Loader2, Plus } from 'lucide-react';
import { PersonDataSheet } from '@/components/PersonDataSheet/PersonDataSheet';
import { Button } from '@/components/ui/button';
import { createPerson, getTreePerson, updatePersonPosition } from '@/lib/personActions';
import { Relationship } from '@/lib/relaionshipInterfaces';
import { RelationshipsList } from '@/components/RelationshipsSheet/RelationshipsList';
import { PartnerPicker, RelationshipEditor } from '@/components/RelationshipsSheet/RelationshipEditor';
import { createRelationship, deleteRelationship, updateRelationship } from '@/lib/relationshipActions';

interface Props {
  params: {
    treeId: string
  }
}

export default function Page({ params: { treeId } }: Props) {
  const [tree, setTree] = useState<Tree | null>(null);
  
  useEffect(() => {
    getTree(+treeId)
      .then(t => setTree(t))
  }, [treeId])

  if (tree) {
    return <LoadedPage tree={tree} setTree={setTree} />
  } else {
    return <div className='flex-1 flex items-center justify-center'><Loader2 className="h-16 w-16 animate-spin" /></div>
  }
}

interface LoadedPageProps {
  tree: Tree;
  setTree: (t: Tree) => void;
}

function LoadedPage({ tree, setTree }: LoadedPageProps) {
  const [selectedPerson, setSelectedPerson] = useState<TreePerson | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<number | "new" | null>(null);
  const [isRelationsSheetOpened, setRelationsSheetOpened] = useState(false);
  const [partnerPicker, setPartnerPicker] = useState<PartnerPicker | null>(null);
  const mapRef = useRef<MapHandle | null>(null);

  const peopleHighlights = !partnerPicker ?
    {} : 
    tree.people.reduce((acc: HighlightData, p) => {
      if (partnerPicker.forbiddenPartnerIds.includes(p.id)) {
        acc[p.id] = "hsl(var(--destructive))";
      } else {
        acc[p.id] = "#44adef";
      }
      return acc;
    }, {})

  const handleAddPerson = async () => {
    const newPersonPosition = mapRef.current!.getViewMiddlePosition();
    const newPerson = await createPerson(newPersonPosition);
    tree.people.push(newPerson);
    setTree({...tree});
  }

  const handlePersonDataSheetClose = async () => {
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

  const handlePersonClick = (person: TreePerson) => {
    if (!selectedRelation && !isRelationsSheetOpened) {
      setSelectedPerson(person);
    } else if (partnerPicker && !partnerPicker.forbiddenPartnerIds.includes(person.id)) {
      partnerPicker.pickPartner(person.id)
    }
  };

  const handlePersonDrop = (position: Position, person: TreePerson) => {
    person.position = position;
    setTree({...tree});
    updatePersonPosition(person.id, position);
  }

  const handleRelationshipClick = (id: number | "new") => {
    if (selectedRelation === null) {
      setSelectedRelation(id);
    }
  }

  const handleRelationshipEditorClose = () => {
    setSelectedRelation(null);
  }

  const handleRelationshipEditorSave = async (rel: Relationship) => {
    if (selectedRelation === "new") {
      const newRelationData = await createRelationship(rel);
      tree.relationships.push(newRelationData);
    } else {
      await updateRelationship(rel);
      const updatedRelationIndex = tree.relationships.findIndex((r) => r.id === selectedRelation!);
      tree.relationships[updatedRelationIndex] = rel;
    }
    setTree({ ...tree });
    setSelectedRelation(null);
  };

  const handleRelationshipEditorDelete = async () => {
    await deleteRelationship(selectedRelation as number);
    const updatedRelationIndex = tree.relationships.findIndex((r) => r.id === selectedRelation!);
    tree.relationships.splice(updatedRelationIndex, 1);
    setTree({ ...tree });
    setSelectedRelation(null);
  };

  return (
    <>
      <Map
        ref={mapRef}
        people={tree.people}
        relationships={tree.relationships}
        parenthoods={tree.parenthoods}
        peopleHighlights={peopleHighlights}
        onPersonClick={handlePersonClick}
        onPersonDrop={handlePersonDrop}
        onRelationshipClick={handleRelationshipClick}
      />

      <Button onClick={() => setRelationsSheetOpened(true)} size="icon" className='absolute right-24 bottom-8'>
        <Heart className="h-4 w-4" />
      </Button>
      <Button onClick={handleAddPerson} size="icon" className='absolute right-8 bottom-8'>
        <Plus className="h-4 w-4" />
      </Button>

      <PersonDataSheet
        onClose={handlePersonDataSheetClose}
        person={selectedPerson}
      />

      <RelationshipsList
        isOpened={isRelationsSheetOpened}
        relationships={tree.relationships}
        people={tree.people}
        onRelationshipClick={handleRelationshipClick}
        onClose={() => setRelationsSheetOpened(false)}
      />
      <RelationshipEditor
        relationshipId={selectedRelation}
        people={tree.people}
        partnerPicker={partnerPicker}
        setPartnerPicker={setPartnerPicker}
        onClose={handleRelationshipEditorClose}
        onSave={handleRelationshipEditorSave}
        onDelete={handleRelationshipEditorDelete}
      />
    </>
  )
}