import { getAdminCourse } from "@/app/data/admin/admin-get-course"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";


type Params = Promise<{ courseId: string }>
export default async function EditCoursePage({ params }: { params: Params }) {

    const { courseId } = await params;

    const data = await getAdminCourse(courseId);

    return (
        <div>
            <h1 className="tet-3xl font-bold mb-8">
                Edit Course
                <span className="text-primary underline">{data.title}</span>
            </h1>
            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Provide basic information about the course</CardDescription>
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}