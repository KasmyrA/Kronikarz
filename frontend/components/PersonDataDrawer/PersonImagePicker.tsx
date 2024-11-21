/* eslint-disable @next/next/no-img-element */
import { FileInfo } from "@/lib/personInterfaces";
import { Card } from "../ui/card";
import { Upload, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { isImageFile } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { addFileToPerson } from "@/lib/personActions";
import { ChangeEventHandler, useRef } from "react";

interface Props {
  image: number | null;
  setImage: (image: number | null) => void;
  files: FileInfo[];
  setFiles: (files: FileInfo[]) => void;
  personId: number;
}

export function PersonImagePicker({ image, setImage, files, setFiles, personId }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const imageFile = files.find((f) => f.id === image);
  const personImage = imageFile ? 
    <img src={imageFile.url} alt="Person image" className="size-full object-cover"/> :
    <User className="size-full" />;

  const avaliableImages = files.filter(f => isImageFile(f.name)).map(f => {
    return (
      <SelectItem key={f.id} value={f.id.toString()}>
        <div className="flex items-center">
          <img src={f.url} alt="" className="size-7 aspect-square object-cover mr-3" />
          <span className="text-ellipsis overflow-hidden">{f.name}</span>
        </div>
      </SelectItem>
    )
  })

  const handleValueChange = (value: string) => {
    setImage(JSON.parse(value));
  }

  const handleAddFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files?.length) return;

    const newFile = await addFileToPerson(personId, e.target.files[0]);
    setFiles([ ...files, newFile ]);
    setImage(newFile.id);
  };

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5 mb-4">
        Zdjęcie profilowe
      </h3>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
              <Card className="size-40 m-auto overflow-hidden">
                {personImage}
              </Card>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Select onValueChange={handleValueChange} value={JSON.stringify(image)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">
                    <div className="flex items-center">
                      <User className="size-7 mr-3" />
                      <span className="text-ellipsis overflow-hidden">Brak zdjęcia</span>
                    </div>
                  </SelectItem>
                  {avaliableImages}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="w-10">
              <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={handleAddFile} />
              <Button size="icon" onClick={() => inputRef.current?.click()}>
                <Upload className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}