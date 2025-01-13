"use client";
import { Position, Tree, TreePerson } from '@/lib/treeInterfaces';
import { getTree } from '@/lib/treeActions';
import { HighlightData, Map, MapHandle } from '../../../components/Map/Map';
import { useEffect, useRef, useState } from 'react';
import { Heart, Loader2, Plus, UserPlus } from 'lucide-react';
import { PersonDataSheet } from '@/components/PersonDataSheet/PersonDataSheet';
import { Button } from '@/components/ui/button';
import { addFileToPerson, createPerson, deleteFileFromPerson, deletePerson, getTreePerson, updatePerson, updatePersonPosition } from '@/lib/personActions';

import { Relationship } from '@/lib/relaionshipInterfaces';
import { RelationshipsList } from '@/components/RelationshipsSheet/RelationshipsList';
import { PartnerPicker, RelationshipEditor } from '@/components/RelationshipsSheet/RelationshipEditor';
import { createRelationship, deleteRelationship, updateRelationship } from '@/lib/relationshipActions';

import { Parenthood} from '@/lib/parenthoodInterfaces';
import {ParenthoodList} from '@/components/ParenthoodSheet/ParenthoodList';
import { ParentPicker,ParenthoodEditor} from '@/components/ParenthoodSheet/ParenthoodEditor';
import { createParenthood, deleteParenthood, updateParenthood } from '@/lib/parenthoodActions';

import { FileInfo, Person } from '@/lib/personInterfaces';

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

  const [isParenthoodSheetOpened,setParenthoodSheetOpened] = useState(false);
  const [selectedParenthood, setSelectedParenthood] = useState<number | "new" | null>(null);
  const [parentPicker, setParentPicker] = useState<ParentPicker | null>(null);
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

  const handlePersonDataSheetClose = () => {
    setSelectedPerson(null);
  };

  const handlePersonDataSheetSave = async (pers: Omit<Person, "files">) => {
    await updatePerson(pers);
    const newPersonData = await getTreePerson(pers.id);
    const updatedPersonIndex = tree.people.findIndex((p) => p.id === pers.id);
    tree.people[updatedPersonIndex] = newPersonData!;
    setTree({...tree});
    setSelectedPerson(null);
  };

  const handlePersonDataSheetDelete = async () => {
    const { id } = selectedPerson!;
    await deletePerson(id);
    tree.people = tree.people.filter((p) => p.id !== id);
    tree.relationships = tree.relationships.filter((r) => r.partner1 !== id && r.partner2 !== id);
    tree.parenthoods = tree.parenthoods.filter((p) => p.child !== id);
    tree.parenthoods.forEach((p, i) => {
      if (p.father === id) {
        p.father = null;
      } else if (p.mother === id) {
        p.mother = null;
      } else if (p.adoption?.father === id) {
        p.adoption.father = null;
      } else if (p.adoption?.mother === id) {
        p.adoption.mother = null;
      }
      tree.parenthoods[i] = p;
    });
    setTree({...tree});
    setSelectedPerson(null);
  };

  const handlePersonDataSheetFileAdd = async (f: File) => {
    const { id } = selectedPerson!;
    return await addFileToPerson(id, f);
  };

  const handlePersonDataSheetFileDelete = async (f: FileInfo) => {
    const { id } = selectedPerson!;
    await deleteFileFromPerson(id, f.id);
    const updatedPersonIndex = tree.people.findIndex((p) => p.id === id);
    if (tree.people[updatedPersonIndex].imageUrl === f.url) {
      tree.people[updatedPersonIndex].imageUrl = null;
    }
    setTree({...tree});
  };

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

  const handleParenthoodClick =(id:number|"new")=>{
    if(selectedParenthood===null){
      setSelectedParenthood(id);
    }
  }

  const handleParenthoodEditorClose = () => {
    setSelectedParenthood(null);
  };

  const handleParenthoodEditorSave = async (parenthood: Parenthood) => {
    if (selectedParenthood === "new") {
      const newParenthoodData = await createParenthood(parenthood);
      tree.parenthoods.push(newParenthoodData);
    } else {
      await updateParenthood(parenthood);
      const updatedParenthoodIndex = tree.parenthoods.findIndex((r) => r.id === selectedParenthood!);
      tree.parenthoods[updatedParenthoodIndex] = parenthood;
    }
    setTree({ ...tree });
    setSelectedParenthood(null);
  };

  const handleParenthoodEditorDelete = async () => {
    await deleteParenthood(selectedParenthood as number);
    const updatedParenthoodIndex = tree.parenthoods.findIndex((r) => r.id === selectedParenthood!);
    tree.parenthoods.splice(updatedParenthoodIndex, 1);
    setTree({ ...tree });
    setSelectedParenthood(null);
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
      <Button onClick={() => setSelectedParenthood("new")} size="icon" className='absolute right-40 bottom-8'>
        <UserPlus className="h-4 w-4" />
      </Button>

      <PersonDataSheet
        person={selectedPerson}
        onClose={handlePersonDataSheetClose}
        onSave={handlePersonDataSheetSave}
        onDelete={handlePersonDataSheetDelete}
        onFileAdd={handlePersonDataSheetFileAdd}
        onFileDelete={handlePersonDataSheetFileDelete}
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
      <ParenthoodList
      isOpened={isParenthoodSheetOpened}
      parenthoods={tree.parenthoods}
      people={tree.people}
      onParenthoodClick={handleParenthoodClick}
      onClose={()=>setParenthoodSheetOpened(false)}
      />
      <ParenthoodEditor
        parenthoodId={selectedParenthood}
        people={tree.people}
        parentPicker={parentPicker}
        setParentPicker={setParentPicker}
        onClose={handleParenthoodEditorClose}
        onSave={handleParenthoodEditorSave}
        onDelete={handleParenthoodEditorDelete}
        
      />
    </>
  )
}