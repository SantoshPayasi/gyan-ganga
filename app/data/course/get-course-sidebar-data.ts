import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string) {
    const user = await requireUser();

    const course = await prisma.course.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            title: true,
            fileKey: true,
            slug: true,
            category: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            videoKey: true,
                            position: true,
                            lessonProgrss: {
                                where: {
                                    userId: user.id
                                },
                                select: {
                                    completed: true,
                                    id: true,
                                    lessonId: true
                                }
                            }
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }

        }
    })

    if (!course) {
        return notFound();
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: course.id
            }
        }
    })

    if (!enrollment || enrollment.status !== "Active") {
        return notFound();
    }

    return { course }
}

export type CourseSidebarData = Awaited<ReturnType<typeof getCourseSidebarData>>