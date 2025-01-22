"use client";
import { Tree, TreePerson } from '@/lib/treeInterfaces';
import { getTree } from '@/lib/treeActions';
import { HighlightData, Map, MapHandle } from '../../../components/Map/Map';
import { useEffect, useRef, useState } from 'react';
import { Baby, Heart, Loader2, UserPlus } from 'lucide-react';
import { PersonDataSheet } from '@/components/PersonDataSheet/PersonDataSheet';
import { Button } from '@/components/ui/button';
import { addFileToPerson, createPerson, deleteFile, deletePerson, getPerson, personToTreePerson, updatePerson } from '@/lib/personActions';

import { Relationship } from '@/lib/relaionshipInterfaces';
import { RelationshipsList } from '@/components/RelationshipsSheet/RelationshipsList';
import { PartnerPicker, RelationshipEditor } from '@/components/RelationshipsSheet/RelationshipEditor';
import { createRelationship, deleteRelationship, updateRelationship } from '@/lib/relationshipActions';

import { Parenthood} from '@/lib/parenthoodInterfaces';
import {ParenthoodList} from '@/components/ParenthoodSheet/ParenthoodList';
import { ParentPicker,ParenthoodEditor} from '@/components/ParenthoodSheet/ParenthoodEditor';
import { createParenthood, deleteParenthood, updateParenthood } from '@/lib/parenthoodActions';

import { FileInfo, Person } from '@/lib/personInterfaces';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/authActions';

interface Props {
  params: {
    treeId: string
  }
}

export default function Page({ params: { treeId } }: Props) {
  const [tree, setTree] = useState<Tree | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTree = async () => {
      const user = await getCurrentUser();
      if (!user || !("id" in user)) {
        router.replace('/');
        return;
      }

      const tree = await getTree(+treeId);
      if (!tree) {
        router.replace('/tree');
        return
      }

      setTree(tree);
    }
    loadTree();
    
  }, [treeId, router])

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

  const [isParenthoodSheetOpened, setParenthoodSheetOpened] = useState(false);
  const [selectedParenthood, setSelectedParenthood] = useState<number | "new" | null>(null);
  const [parentPicker, setParentPicker] = useState<ParentPicker | null>(null);
  const mapRef = useRef<MapHandle | null>(null);

  const isAnySheetOpened = isRelationsSheetOpened || isParenthoodSheetOpened || !!selectedPerson || !!selectedRelation || !!selectedParenthood;

  const forbiddenPeopleIds = [
    ...(partnerPicker?.forbiddenPartnerIds ?? []),
    ...(parentPicker?.forbiddenParentIds ?? []),
  ];
  const peopleHighlights = (partnerPicker || parentPicker) ?
    tree.people.reduce((acc: HighlightData, p) => {
      if (forbiddenPeopleIds.includes(p.id)) {
        acc[p.id] = "hsl(var(--destructive))";
      } else {
        acc[p.id] = "#44adef";
      }
      return acc;
    }, {}) :
    {};

  const handleAddPerson = async () => {
    const { x, y } = mapRef.current!.getViewMiddlePosition();
    const newPerson = await createPerson(x, y, tree.id);
    if (newPerson) {
      tree.people.push(personToTreePerson(newPerson));
      setTree({...tree});
    }
  }

  const handlePersonDataSheetClose = () => {
    setSelectedPerson(null);
  };

  const handlePersonDataSheetSave = async (pers: Person) => {
    const newPersonData = await updatePerson(pers);
    if (newPersonData) {
      const updatedPersonIndex = tree.people.findIndex((p) => p.id === pers.id);
      tree.people[updatedPersonIndex] = personToTreePerson(newPersonData);
      setTree({...tree});
      setSelectedPerson(null);
    }
  };

  const handlePersonDataSheetDelete = async () => {
    const { id } = selectedPerson!;
    await deletePerson(id);
    tree.people = tree.people.filter((p) => p.id !== id);
    tree.relationships = tree.relationships.filter((r) => r.partner1 !== id && r.partner2 !== id);
    tree.parenthoods = tree.parenthoods.filter((p) => p.child !== id && p.father !== id && p.mother !== id);
    setTree({...tree});
    setSelectedPerson(null);
  };

  const handlePersonDataSheetFileAdd = async (f: File) => {
    const { id } = selectedPerson!;
    return await addFileToPerson(id, f);
  };

  const handlePersonDataSheetFileDelete = async (f: FileInfo) => {
    const resp = await deleteFile(f.id);
    if (!resp?.ok)  return false
    const { id } = selectedPerson!;
    const updatedPersonIndex = tree.people.findIndex((p) => p.id === id);
    if (tree.people[updatedPersonIndex].image?.id === f.id) {
      tree.people[updatedPersonIndex].image = null;
    }
    setTree({...tree});
    return true;
  };

  const handlePersonClick = (person: TreePerson) => {
    if (!isAnySheetOpened) {
      setSelectedPerson(person);
    } else if (partnerPicker && !partnerPicker.forbiddenPartnerIds.includes(person.id)) {
      partnerPicker.pickPartner(person.id)
    } else if (parentPicker && !parentPicker.forbiddenParentIds.includes(person.id)) {
      parentPicker.pickParent(person.id);
    }
  };

  const handlePersonDrop = async (person: TreePerson) => {
    const personData = await getPerson(person.id);
    if (!personData)  return;
    personData.x = person.x;
    personData.y = person.y;
    const newPersonData = await updatePerson(personData);
    if (!newPersonData)  return;
    const updatedPersonIndex = tree.people.findIndex((p) => p.id === person.id);
    tree.people[updatedPersonIndex] = personToTreePerson(newPersonData);
    setTree({...tree});
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
        onRelationshipClick={(r) => !isAnySheetOpened && setSelectedRelation(r)}
        onParenthoodClick={(p) => !isAnySheetOpened && setSelectedParenthood(p)}
      />

      <Button onClick={() => setParenthoodSheetOpened(true)} disabled={isAnySheetOpened} size="icon" className='absolute right-40 bottom-8'>
        <Baby className="h-4 w-4" />
      </Button>
      <Button onClick={() => setRelationsSheetOpened(true)} disabled={isAnySheetOpened} size="icon" className='absolute right-24 bottom-8'>
        <Heart className="h-4 w-4" />
      </Button>
      <Button onClick={handleAddPerson} disabled={isAnySheetOpened} size="icon" className='absolute right-8 bottom-8'>
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
        onRelationshipClick={(r) => setSelectedRelation(r)}
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
        onParenthoodClick={(p) => setSelectedParenthood(p)}
        onClose={() => setParenthoodSheetOpened(false)}
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