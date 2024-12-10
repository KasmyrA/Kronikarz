"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Tree {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string; // Pole dla zdjęcia, teraz opcjonalne
}

// Add this utility function at the top level
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message
    return String(error)
}

export default function TreeList() {
    const [trees, setTrees] = useState<Tree[]>([])
    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string | undefined>(undefined)
    const [imageUrl, setImageUrl] = useState<string>("") // Zmienna dla URL zdjęcia
    const [error, setError] = useState<string>("")
    const [editingTreeId, setEditingTreeId] = useState<number | null>(null) // ID drzewa, które jest edytowane
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTrees = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/trees')
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setTrees(data)
            } catch (error: unknown) {
                setError("Błąd podczas ładowania drzew: " + getErrorMessage(error))
            } finally {
                setLoading(false)
            }
        }
        fetchTrees()
    }, [])

    const addTree = async () => {
        if (!name) {
            setError("Nazwa jest  wymagana.")
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
                throw new Error('Nie udało się dodać drzewa, baza dancych zwróciła błąd.')
            }

            const addedTree = await response.json()
            setTrees([...trees, addedTree])
            resetForm()
        } catch (error: unknown) {
            setError("Błąd podczas dodawania drzewa: " + getErrorMessage(error))
        }
    }

    const updateTree = async () => {
        if (!editingTreeId || !name) {
            setError("Nazwa jest wymagana.")
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
        } catch (error: unknown) {
            setError("Błąd podczas aktualizacji drzewa: " + getErrorMessage(error))
        }
    }

    const startEditing = (tree: Tree) => {
        setEditingTreeId(tree.id)
        setName(tree.name)
        setDescription(tree.description)
        setImageUrl(tree.imageUrl || '')
    }

    const deleteTree = async (id: number) => {
        try {
            await fetch(`/api/trees/${id}`, { method: 'DELETE' })
            const updatedTrees = trees.filter(tree => tree.id !== id)
            setTrees(updatedTrees)
        } catch (error: unknown) {
            setError("Błąd podczas usunięcia drzewa: " + getErrorMessage(error))
        }
    }

    const resetForm = () => {
        setName('')
        setDescription(undefined)
        setImageUrl('')
        setEditingTreeId(null)
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nazwa drzewa"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            placeholder="Opis drzewa"
                            value={description || ''}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                        {editingTreeId ? (
                            <button onClick={updateTree} 
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                                Zaktualizuj drzewo
                            </button>
                        ) : (
                            <button onClick={addTree} 
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                                Dodaj drzewo
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trees.map(tree => (
                        <Card key={tree.id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">{tree.name}</CardTitle>
                                <CardDescription className="text-gray-600">{tree.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {tree.imageUrl && (
                                    <div className="relative h-48 mb-4">
                                        <img 
                                            src={tree.imageUrl} 
                                            alt={tree.name} 
                                            className="object-cover w-full h-full rounded-md"
                                        />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2">
                                <button 
                                    onClick={() => startEditing(tree)} 
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                                    Edytuj
                                </button>
                                <button 
                                    onClick={() => deleteTree(tree.id)} 
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                                    Usuń
                                </button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
