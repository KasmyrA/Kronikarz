/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/authActions";
import { Header } from "@/components/Header";
import { Tree } from "@/lib/treeInterfaces";
import { addTree, deleteTree, getTreeList } from "@/lib/treeActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";


export default function TreeList() {
  const [trees, setTrees] = useState<Tree[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrees = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/');
        return;
      }

      const t = await getTreeList();
      setTrees(t);
    }
    fetchTrees()
  }, [router])

  if (trees) {
    return <LoadedTreeList trees={trees} setTrees={setTrees} />
  } else {
    return <div className='flex-1 flex items-center justify-center'><Loader2 className="size-16 animate-spin" /></div>
  }
}

interface LoadedTreeListProps {
  trees: Tree[];
  setTrees: (t: Tree[]) => void;
}

function LoadedTreeList({ trees, setTrees }: LoadedTreeListProps) {
  const treeCards = trees.map((tree) => {
    const handleTreeDelete = async () => {
      await deleteTree(tree.id);
      setTrees(trees.filter((t) => t.id !== tree.id));
    }

    return (
      <Card key={tree.id} className="min-h-52 h-min hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{tree.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="my-2">Drzewo posiada {tree.people.length} osób</p>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button variant="destructive" onClick={handleTreeDelete}>
            Usuń
          </Button>
          <Button>
            <Link href={`/tree/${tree.id}`}>Edytuj</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  })

  const handleTreeAdd = async (treeName: string) => {
    const newTree = await addTree(treeName);
    setTrees([newTree, ...trees]);
  }

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
        <NewTreeCard onAddClick={handleTreeAdd} />
        {treeCards}
      </div>
    </>
  )
}

interface NewTreeCardProps {
  onAddClick: (treeName: string) => void;
}

function NewTreeCard({ onAddClick }: NewTreeCardProps) {
  const [name, setName] = useState<string>("")

  return (
    <Card className="min-h-52 h-min hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Dodaj nowe drzewo
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Input placeholder="Podaj nazwę drzewa" value={name} onChange={(e) => setName(e.target.value)} />
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={() => onAddClick(name)} disabled={name.length === 0}>
          Dodaj
        </Button>
      </CardFooter>
    </Card>
  )
}