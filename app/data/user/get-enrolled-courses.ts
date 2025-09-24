import "server-only";
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";

export async function getEnrolledCourses() {
    const user = await requireUser();

    const data = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            status: "Active"
        },
        select: {
            id: true,
            Course: {
                select: {
                    id: true,
                    smallDescription: true,
                    title: true,
                    fileKey: true,
                    level: true,
                    duration: true,
                    status: true,
                    slug: true,
                    chapter: {
                        select: {
                            id: true,
                            lessons: {
                                select: {
                                    id: true,
                                    lessonProgrss: {
                                        where: {
                                            userId: user.id
                                        },
                                        select: {
                                            id: true,
                                            lessonId: true,
                                            completed: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    return data;
}

export type GetEnrolledCoursesType = Awaited<ReturnType<typeof getEnrolledCourses>>[0]