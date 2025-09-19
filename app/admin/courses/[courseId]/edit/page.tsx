import { getAdminCourse } from "@/app/data/admin/admin-get-course"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import { EditCourseForm } from "./_components/edit-form";
import { CourseSchemaType } from "@/lib/zodSchemas";
import { CourseStructure } from "./_components/course-structure";


type Params = Promise<{ courseId: string }>
export default async function EditCoursePage({ params }: { params: Params }) {

    const { courseId } = await params;

    const data = await getAdminCourse(courseId);


    const filteredData = {
        ...data,
        category: data.category as CourseSchemaType["category"],
    };



    return (
        <div>
            <h1 className="tet-3xl font-bold mb-8">
                Edit Course
                <span className="text-primary underline">{filteredData.title}</span>
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
                        <CardContent>
                            <EditCourseForm courseId={courseId} filteredData={filteredData} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>Define the structure of the course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* <EditCourseForm courseId={courseId} filteredData={filteredData} /> */}
                            <CourseStructure data={filteredData} />
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}