"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface Tree {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string; // Pole dla zdjęcia, teraz opcjonalne
}

export default function TreeList() {
    const [trees, setTrees] = useState<Tree[]>([])
    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string>("") // Zmienna dla URL zdjęcia
    const [error, setError] = useState<string>("")
    const [editingTreeId, setEditingTreeId] = useState<number | null>(null) // ID drzewa, które jest edytowane

    useEffect(() => {
        const fetchTrees = async () => {
            try {
                const response = await fetch('/api/trees')
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setTrees(data)
            } catch (error) {
                setError("Błąd podczas ładowania drzew: " + error.message)
            }
        }
        fetchTrees()
    }, [])

    const addTree = async () => {
        if (!name || !description) {
            setError("Nazwa i opis są wymagane.")
            return
        }

        const newTree = { name, description}
        try {
            const response = await fetch('/api/trees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTree),
            })

            if (!response.ok) {
                throw new Error('Failed to add tree')
            }

            const addedTree = await response.json()
            setTrees([...trees, addedTree])
            resetForm()
        } catch (error) {
            setError("Błąd podczas dodawania drzewa: " + error.message)
        }
    }

    const updateTree = async () => {
        if (!editingTreeId || !name || !description) {
            setError("Nazwa i opis są wymagane.")
            return
        }

        try {
            await fetch(`/api/trees/${editingTreeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            })

            const updatedTrees = trees.map(tree => tree.id === editingTreeId ? { ...tree, name, description } : tree)
            setTrees(updatedTrees)
            resetForm()
        } catch (error) {
            setError("Błąd podczas aktualizacji drzewa: " + error.message)
        }
    }

    const startEditing = (tree: Tree) => {
        setEditingTreeId(tree.id)
        setName(tree.name)
        setDescription(tree.description)
        setImageUrl(tree.imageUrl)
    }

    const deleteTree = async (id: number) => {
        try {
            await fetch(`/api/trees/${id}`, { method: 'DELETE' })
            const updatedTrees = trees.filter(tree => tree.id !== id)
            setTrees(updatedTrees)
        } catch (error) {
            setError("Błąd podczas usunięcia drzewa: " + error.message)
        }
    }

    const resetForm = () => {
        setName('')
        setDescription('')
        setImageUrl('')
        setEditingTreeId(null)
    }

    return (
        <div className="p-4">
            {error && <div className="text-red-500">{error}</div>}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Nazwa drzewa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Opis drzewa"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 mr-2"
                />
                {editingTreeId ? (
                    <button onClick={updateTree} className="bg-green-500 text-white p-2">Zaktualizuj drzewo</button>
                ) : (
                    <button onClick={addTree} className="bg-blue-500 text-white p-2">Dodaj drzewo</button>
                )}
            </div>
            {editingTreeId && (
                <div className="mb-4">
                    <input
                        type="file"
                        onChange={(e) => setImageUrl(e.target.files[0])}
                        className="border p-2 mr-2"
                    />
                    <button onClick={startEditing} className="bg-yellow-500 text-white p-2">Edytuj</button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trees.map(tree => (
                    <Card key={tree.id}>
                        <CardHeader>
                            <CardTitle>{tree.name}</CardTitle>
                            <CardDescription>{tree.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tree.imageUrl && <img src={tree.imageUrl} alt={tree.name} className="w-full h-auto" />}
                            <p>Więcej szczegółów o {tree.name}.</p>
                        </CardContent>
                        <CardFooter>
                            <button onClick={() => startEditing(tree)} className="bg-yellow-500 text-white p-2">Edytuj</button>
                            <button onClick={() => deleteTree(tree.id)} className="bg-red-500 text-white p-2">Usuń</button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
