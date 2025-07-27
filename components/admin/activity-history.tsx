import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockActivity = [
  { user: "Alice", action: "uploaded 'Q4_Presentation.pptx'", time: "2 hours ago", avatar: "A" },
  { user: "Bob", action: "logged in", time: "5 hours ago", avatar: "B" },
  { user: "admin", action: "deleted user 'charlie'", time: "1 day ago", avatar: "AD" },
  { user: "David", action: "uploaded 'logo-final.svg'", time: "2 days ago", avatar: "D" },
]

export function ActivityHistory() {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6 space-y-6">
        {mockActivity.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={`/placeholder.svg?width=40&height=40&query=${activity.user}`} />
              <AvatarFallback className="bg-purple-600 text-white">{activity.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold text-white">{activity.user}</span>
                <span className="text-gray-300"> {activity.action}</span>
              </p>
            </div>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
