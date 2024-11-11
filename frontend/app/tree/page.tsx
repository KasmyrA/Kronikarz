"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface Tree {
    id: number;
    name: string;
    description?: string;
}

export default function TreeList() {
    const [trees, setTrees] = useState<Tree[]>([])
    const [name, setName] = useState<string | null>(null) // Nazwa drzewa może być null
    const [description, setDescription] = useState<string | null>(null) // Opis drzewa może być null
    const [imageUrl, setImageUrl] = useState<string | null>(null) // URL zdjęcia może być null
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

        try {
            const newTree = { name, description}
            try {
                await fetch('/api/trees', {
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
        } catch (error) {
            setError("Błąd podczas dodawania drzewa: " + error.message)
        }
    }

    const generateName = () => {
        return `Drzewo ${trees.length + 1}`;
    }

    const addTreeWithoutName = async () => {
        try {
            await fetch('/api/trees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: generateName() }),
            })

            if (!response.ok) {
                throw new Error('Failed to add tree')
            }

            const addedTree = await response.json()
            setTrees([...trees, addedTree])
        } catch (error) {
            setError("Błąd podczas dodawania drzewa: " + error.message)
        }
    }

    const resetForm = () => {
        setName(null);
        setDescription(null);
        setImageUrl(null);
    }

    return (
        <div>
            {trees.length > 0 ? (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Nazwa drzewa"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 mr-2"
                    />
                    {name && (
                        <input
                            type="text"
                            placeholder="Opis drzewa"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border p-2 mr-2"
                        />
                    )}
                    {name || description ? (
                        <button onClick={addTree} className="bg-blue-500 text-white p-2">Dodaj drzewo</button>
                    ) : (
                        <button onClick={addTreeWithoutName} className="bg-green-500 text-white p-2">Dodaj bez nazwy</button>
                    )}
                </div>
            ) : (
                <p>Nazwa i opis są wymagane.</p>
            )}
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
            {editingTreeId ? (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Opis drzewa"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 mr-2"
                    />
                    <button onClick={updateTree} className="bg-green-500 text-white p-2">Zaktualizuj drzewo</button>
                </div>
            ) : (
                <p>Opis jest opcjonalny.</p>
            )}
            {editingTreeId ? (
                <div className="mb-4">
                    <input
                        type="file"
                        onChange={(e) => setImageUrl(e.target.files[0])}
                        className="border p-2 mr-2"
                    />
                    <button onClick={startEditing} className="bg-yellow-500 text-white p-2">Edytuj</button>
                </div>
            ) : (
                <p>Opis jest opcjonalny.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trees.map(tree => (
                    <Card key={tree.id}>
                        <CardHeader>
                            <CardTitle>{tree.name}</CardTitle>
                            <CardDescription>{tree.description || 'Brak opisu'}</CardDescription>
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
