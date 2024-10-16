"use client";
import { Tree } from '@/lib/treeInterfaces';
import { getTree } from '@/lib/treeActions';
import { Map } from './Map';
import { useEffect, useState } from 'react';

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
    return <Map tree={tree} setTree={setTree} />
  } else {
    return <div className='flex-1 flex items-center justify-center'>Ładowanie</div>
  }
}