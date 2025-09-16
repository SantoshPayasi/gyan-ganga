import CourseForm from "@/components/courseForms/form";
import { CourseSchemaType } from "@/lib/zodSchemas";
import { updateCourse } from "../action";

interface iAppProps {
    courseId: string,
    filteredData: CourseSchemaType
}

export async function EditCourseForm({ courseId, filteredData }: iAppProps) {

    async function handleEdit(values: CourseSchemaType) {
        "use server";
        return updateCourse(values, courseId);
    }


    return (
        <CourseForm
            mode="edit"
            defaultValues={filteredData}
            SubmitHandler={handleEdit}
        />
    )
}