/* eslint-disable @next/next/no-img-element */
import { FileInfo } from "@/lib/personInterfaces";
import { Card } from "../ui/card";
import { Download, File as FileIcon, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { ChangeEventHandler, useRef } from "react";
import { addFileToPerson, deleteFileFromPerson } from "@/lib/personActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Props {
  files: FileInfo[];
  setFiles: (files: FileInfo[]) => void;
  image: number | null;
  setImage: (image: number | null) => void;
  personId: number;
}

export function PersonFilesList({ files, setFiles, image, setImage, personId }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fileCards = files.map((file) => {
    const fileImage = isImageFile(file.name) ? 
      <img src={file.url} alt="File image" className="size-full object-cover"/> :
      <FileIcon className="size-10" />;

    const handleDeleteFile = async () => {
      await deleteFileFromPerson(personId, file.id);
      setFiles(files.filter(f => f.id !== file.id));
      if (image === file.id)  setImage(null);
    }

    return (
      <DropdownMenu key={file.id}>
        <DropdownMenuTrigger asChild>
          <Button title={file.name} variant="outline" className="w-32 h-40 p-4 flex-col justify-between">
            <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
              { fileImage }
            </div>
            <h4 className="text-sm text-muted-foreground text-center w-full text-ellipsis overflow-hidden">
              { file.name }
            </h4>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <a href={file.url} download={file.name}>
              <DropdownMenuItem>
                <Download />
                Pobierz
              </DropdownMenuItem>
            </a>
            <DropdownMenuItem onClick={handleDeleteFile}>
              <Trash className="text-destructive" />
              <span className="text-destructive">Usuń { image === file.id && "(usunie również zdjęcie profilowe)" }</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  });

  const handleAddFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files?.length) return;

    const newFile = await addFileToPerson(personId, e.target.files[0]);
    setFiles([ ...files, newFile ]);
  };

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5 mb-4">
        Pliki
      </h3>
      <Card className="p-4 flex flex-wrap gap-2">
        { fileCards }
        <input type="file" className="hidden" ref={inputRef} onChange={handleAddFile} />
        <Button onClick={() => inputRef.current?.click()} variant="outline" className="w-32 h-40 flex flex-col items-center justify-center">
          <Plus className="size-8" />
          Dodaj plik
        </Button>
      </Card>
    </>
  )
}

function isImageFile(fileName: string) {
  const fileExtension = fileName.split(".").at(-1)!;
  return ["jpg", "jpeg", "png"].includes(fileExtension);
}