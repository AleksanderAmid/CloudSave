import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

const mockUsers = [
  {
    id: 1,
    name: "Admin",
    email: "admin@futuredrive.com",
    role: "Admin",
    storageUsed: 65,
    storageQuota: 100,
    status: "Active",
  },
  {
    id: 2,
    name: "Alice",
    email: "alice@example.com",
    role: "User",
    storageUsed: 20,
    storageQuota: 50,
    status: "Active",
  },
  { id: 3, name: "Bob", email: "bob@example.com", role: "User", storageUsed: 45, storageQuota: 50, status: "Inactive" },
  {
    id: 4,
    name: "David",
    email: "david@example.com",
    role: "User",
    storageUsed: 10,
    storageQuota: 25,
    status: "Active",
  },
]

export function UserManagementTable() {
  return (
    <div className="border rounded-lg border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800/50">
            <TableHead className="text-white">User</TableHead>
            <TableHead className="text-white">Role</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Storage Usage</TableHead>
            <TableHead className="text-right text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsers.map((user) => (
            <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800/50">
              <TableCell>
                <div className="font-medium text-white">{user.name}</div>
                <div className="text-sm text-gray-400">{user.email}</div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "Admin" ? "default" : "secondary"}
                  className={user.role === "Admin" ? "bg-purple-600" : "bg-gray-600"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "Active" ? "outline" : "destructive"}
                  className={
                    user.status === "Active" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <Progress
                    value={(user.storageUsed / user.storageQuota) * 100}
                    className="h-2 [&>div]:bg-purple-500"
                  />
                  <span className="text-xs text-gray-400">
                    {user.storageUsed}GB / {user.storageQuota}GB
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem>Edit Storage</DropdownMenuItem>
                    <DropdownMenuItem>View Activity</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
