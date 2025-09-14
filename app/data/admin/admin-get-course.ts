import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getAdminCourse(courseId: string) {
    await requireAdmin();

    // Simulate fetching course data from a database
    const data = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            price: true,
            status: true,
            level: true,
            fileKey: true,
            slug: true,
            duration: true,
            createdAt: true,
            updatedAt: true,
            category: true,
        }
    });

    if (!data) {
        return notFound();
    }

    return data;
}


export type AdminCourseDetailType = Awaited<ReturnType<typeof getAdminCourse>>;