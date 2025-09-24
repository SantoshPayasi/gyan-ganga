import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getAdminRecentCourses() {
    await requireAdmin();

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 2,
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


// Implement the pagination logic with prisma and return the data
/*
   
*/