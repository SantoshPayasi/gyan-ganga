import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetEnrollments() {
    await requireAdmin();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await prisma.enrollment.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo
            }
        },
        orderBy: {
            createdAt: 'asc'
        }

    })

    let lastthirtyDays: { date: string, enrollments: number }[] = [];


    for (let index = 29; index >= 0; index--) {
        const date = new Date();
        date.setDate(date.getDate() - index);
        const dayString = date.toISOString().split('T')[0];
        lastthirtyDays.push({ date: dayString, enrollments: 0 })
    }

    data.forEach(enrollment => {
        const date = new Date(enrollment.createdAt);
        const dayString = date.toISOString().split('T')[0];
        const index = lastthirtyDays.findIndex(day => day.date === dayString);
        if (index !== -1) {
            lastthirtyDays[index].enrollments++;
        }
    })

    return lastthirtyDays


}