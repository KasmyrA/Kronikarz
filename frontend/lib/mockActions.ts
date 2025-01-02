import { Tree, TreePerson, Position } from '@/lib/treeInterfaces';
import { Relationship } from '@/lib/relaionshipInterfaces';
import { Parenthood } from '@/lib/parenthoodInterfaces';

export const mockGetTree = async (treeId: number): Promise<Tree> => {
  return {
    id: treeId,
    people: [],
    relationships: [],
    parenthoods: []
  };
};

export const mockCreatePerson = async (position: Position): Promise<TreePerson> => {
  return {
    id: Date.now(),
    name: 'New Person',
    position
  };
};

export const mockGetTreePerson = async (id: number): Promise<TreePerson | null> => {
  return {
    id,
    name: 'Updated Person',
    position: { x: 0, y: 0 }
  };
};

export const mockUpdatePersonPosition = async (id: number, position: Position): Promise<void> => {
  console.log(`Updated position of person ${id} to`, position);
};

export const mockCreateRelationship = async (rel: Relationship): Promise<Relationship> => {
  return { ...rel, id: Date.now() };
};

export const mockUpdateRelationship = async (rel: Relationship): Promise<void> => {
  console.log(`Updated relationship ${rel.id}`);
};

export const mockDeleteRelationship = async (id: number): Promise<void> => {
  console.log(`Deleted relationship ${id}`);
};

export const mockUpdateParenthood = async (parenthood: Parenthood): Promise<void> => {
  console.log(`Updated parenthood ${parenthood.id}`);
};
