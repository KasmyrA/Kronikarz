import { XCircle } from "lucide-react"

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive animate-in">
      <XCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
