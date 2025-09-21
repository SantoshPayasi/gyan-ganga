import { IconBook, IconPlaylistX, IconShoppingCart, IconUsers } from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total SignUps</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              2400
            </CardTitle>
          </div>
          <IconUsers className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Registered Users on the platform</p>
        </CardFooter>
      </Card>


      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              1000
            </CardTitle>
          </div>
          <IconShoppingCart className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground"> Users enrolled in courses</p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              100
            </CardTitle>
          </div>
          <IconBook className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Available courses in the platform.</p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Lessons</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              1000
            </CardTitle>
          </div>
          <IconPlaylistX className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Total learning content available.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
