import { UserManagementTable } from "@/components/admin/user-management-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function UserManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <UserManagementTable />
    </div>
  )
}
