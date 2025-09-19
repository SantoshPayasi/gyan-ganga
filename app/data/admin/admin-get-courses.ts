import { tryCatch } from "@/hooks/try-catch";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";


export async function getAdminCourses() {
    await requireAdmin();

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            price: true,
            status: true,
            level: true,
            fileKey: true,
            slug: true,
            duration: true
        }
    })

    return data;
}



export type AdminCourseType = Awaited<ReturnType<typeof getAdminCourses>>[number]