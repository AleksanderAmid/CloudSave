import Image from "next/image"
import { File, FileText, Music, Video, Archive, MoreVertical } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const mockFiles = [
  { name: "Project_Alpha.docx", type: "doc", size: "2.3 MB" },
  { name: "Vacation_Photo.png", type: "png", size: "4.1 MB", url: "/placeholder.svg?width=400&height=300" },
  { name: "Q3_Report.pdf", type: "pdf", size: "1.2 MB" },
  { name: "Soundtrack.mp3", type: "mp3", size: "5.8 MB" },
  { name: "Website_Backup.zip", type: "zip", size: "25.6 MB" },
  { name: "Corporate_Video.mp4", type: "mp4", size: "120.4 MB" },
  { name: "Another_Image.jpg", type: "jpg", size: "3.2 MB", url: "/placeholder.svg?width=400&height=300" },
]

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-10 w-10 text-red-500" />
    case "png":
    case "jpg":
      return <File className="h-10 w-10 text-blue-500" />
    case "mp3":
      return <Music className="h-10 w-10 text-purple-500" />
    case "mp4":
      return <Video className="h-10 w-10 text-green-500" />
    case "zip":
      return <Archive className="h-10 w-10 text-yellow-500" />
    default:
      return <File className="h-10 w-10 text-gray-500" />
  }
}

export function FileBrowser() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {mockFiles.map((file) => (
        <Card key={file.name} className="bg-gray-800/50 border-gray-700 overflow-hidden group">
          <CardHeader className="p-0">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              {file.url ? (
                <Image
                  src={file.url || "/placeholder.svg"}
                  alt={file.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                getFileIcon(file.type)
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-sm font-medium truncate text-white">{file.name}</CardTitle>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-gray-400">
            <span>{file.size}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem>Download</DropdownMenuItem>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
