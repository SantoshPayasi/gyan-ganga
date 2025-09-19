import { adminGetLesson } from "@/app/data/admin/admin-get-lesson"
import { LessonForm } from "./_components/lesson-form";

type Params = Promise<{

    courseId: string,
    chapterId: string,
    lessonId: string

}>

export default async function SingleLessonPage({ params }: { params: Params }) {
    const { courseId, chapterId, lessonId } = await params;
    const lesson = await adminGetLesson({ id: lessonId });
    return (
        <LessonForm chapterId={chapterId} data={lesson} courseId={courseId} />
    )
}