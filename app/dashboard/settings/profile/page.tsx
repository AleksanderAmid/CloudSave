import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?width=80&height=80" />
              <AvatarFallback className="bg-purple-600 text-white text-2xl">AD</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700 bg-transparent">
              Change Avatar
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              Username
            </Label>
            <Input id="username" defaultValue="admin" className="bg-gray-900/50 border-gray-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="admin@futuredrive.com"
              className="bg-gray-900/50 border-gray-700"
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
