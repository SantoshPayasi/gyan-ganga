import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getLessonContent(lessonId: string) {
    const uid = await requireUser();


    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailKey: true,
            videoKey: true,
            position: true,
            lessonProgrss: {
                where: {
                    userId: uid
                },
                select: {
                    completed: true,
                    id: true
                }
            },
            Chapter: {
                select: {
                    courseId: true,
                    Course: {
                        select: {
                            slug: true
                        }
                    }
                }
            }
        }
    })

    if (!lesson) {
        return notFound();
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: uid,
                courseId: lesson.Chapter?.courseId as string
            }
        },
        select: {
            status: true
        }
    })

    if (!enrollment || enrollment?.status !== "Active") {
        return notFound();
    }

    return lesson;
}


export type GetLessonContentType = Awaited<ReturnType<typeof getLessonContent>>