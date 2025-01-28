import { XCircle } from "lucide-react"

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive animate-in ">
      <XCircle className="h-6 w-6" />
      <p className="text-red-700">{message}</p>
    </div>
  )
}
