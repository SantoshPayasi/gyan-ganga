"use client"
import { CourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { useMemo } from "react";

interface iAppProps {
    courseData: CourseSidebarData["course"]
}

interface CourseProgressResolved {
    totalLessons: number,
    completedLessons: number,
    progress: number
}
export function useCourseProgress({ courseData }: iAppProps) {
    return useMemo(() => {
        let totalLessons = 0;
        let completedLessons = 0;

        courseData.chapter.forEach(chapter => {
            chapter.lessons.forEach(lesson => {
                totalLessons++;
                const isCompleted = lesson.lessonProgrss.some(progress => progress.lessonId === lesson.id && progress.completed);
                if (isCompleted) {
                    completedLessons++;
                }
            })
        })

        const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return {
            totalLessons,
            completedLessons,
            progress
        } as CourseProgressResolved;

    }, [courseData])
}