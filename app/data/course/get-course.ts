import { prisma } from "@/lib/db";
import { NotFound } from "@aws-sdk/client-s3";
import { notFound } from "next/navigation";

export async function getSingleCourse(slug: string) {
    const course = await prisma.course.findUnique({
        where: {
            slug: slug
        },
        select: {
            title: true,
            price: true,
            smallDescription: true,
            description: true,
            slug: true,
            fileKey: true,
            id: true,
            level: true,
            duration: true,
            category: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                },
                orderBy: {
                    position: 'asc',

                }
            }
        }
    });

    if (!course) {
        return notFound();
    }

    return course;
}


export type PublicSingleCourseType = Awaited<ReturnType<typeof getSingleCourse>>;