/* eslint-disable @next/next/no-img-element */
import { FileInfo } from "@/lib/personInterfaces";
import { Card } from "../ui/card";
import { Upload, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { isImageFile } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ChangeEventHandler, useRef } from "react";
import { serverAddress } from "@/lib/authActions";

interface Props {
  image: FileInfo | null;
  files: FileInfo[];
  setImage: (image: FileInfo | null) => void;
  onFileAdd: (f: File) => Promise<FileInfo | undefined>;
}

export function PersonImagePicker({ image, files, setImage, onFileAdd }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const personImage = image ? 
    <img src={`${serverAddress}${image.file}`} alt="Person image" className="size-full object-cover"/> :
    <User className="size-full" />;

  const avaliableImages = files.filter(f => isImageFile(f.file)).map(f => {
    const fileName = f.file.split('/').at(-1);
    return (
      <SelectItem key={f.id} value={f.id.toString()}>
        <div className="flex items-center">
          <img src={`${serverAddress}${f.file}`} alt="" className="size-7 aspect-square object-cover mr-3" />
          <span className="text-ellipsis overflow-hidden">{fileName}</span>
        </div>
      </SelectItem>
    )
  })

  const handleValueChange = (value: string) => {
    const imageId : number | null = JSON.parse(value);
    const image = files.find((f) => f.id === imageId) ?? null;
    setImage(image);
  }

  const handleAddFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files?.length) return;

    const newFile = await onFileAdd(e.target.files[0]);
    if (newFile) setImage(newFile);
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
              <Select onValueChange={handleValueChange} value={JSON.stringify(image?.id ?? null)}>
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