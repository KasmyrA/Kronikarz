import { Check, Pen, X } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";


interface Props {
  treeName: string;
  onNameChange: (name: string) => void;
}

export function TreeNameEditor({ treeName, onNameChange}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  const switchToEdit = () => {
    setEditedName(treeName);
    setIsEditing(true);
  }

  const cancelEdit = () => {
    setIsEditing(false);
  }

  const acceptEdit = () => {
    onNameChange(editedName);
    setIsEditing(false);
  }

  return (
    <div className='flex p-2 bg-white border-input border rounded-md absolute left-20 top-8'>
      {isEditing ?
        <Input className='w-32 h-6' value={editedName} onChange={(e) => setEditedName(e.target.value)} /> :
        <p className='w-32 ml-1 my-[2px] text-sm'>{treeName}</p>
      }
      <div className='flex ml-2 justify-center items-center gap-2'>
        {isEditing ?
          <>
            <Check onClick={acceptEdit} className="size-4 cursor-pointer" />
            <X onClick={cancelEdit} className="size-4 cursor-pointer" />
          </> :
          <Pen onClick={switchToEdit} className="size-4 cursor-pointer" />
        }
      </div>
    </div>
  )
}