import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Skeleton className="h-10 w-full md:w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="all" disabled>
                Todas
              </TabsTrigger>
              <TabsTrigger value="unread" disabled>
                No leídas
              </TabsTrigger>
              <TabsTrigger value="read" disabled>
                Leídas
              </TabsTrigger>
              <TabsTrigger value="archived" disabled>
                Archivadas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="mb-8">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-5 w-48" />
                          </div>
                          <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-4 w-full mt-2" />
                      </CardHeader>
                      <CardFooter className="pt-0 pb-3 flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-7 w-24" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-5 w-48" />
                          </div>
                          <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-4 w-full mt-2" />
                      </CardHeader>
                      <CardFooter className="pt-0 pb-3 flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-7 w-24" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
