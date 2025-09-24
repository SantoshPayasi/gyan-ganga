import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive"
import { SectionCards } from "@/components/sidebar/section-cards"
import { adminGetEnrollments } from "../data/admin/admin-get-enrollment"
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getAdminRecentCourses } from "../data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/admin-course-card";
import { Suspense } from "react";




export default async function Page() {

  const enrollmentData = await adminGetEnrollments();
  return (
    <>
      <SectionCards />

      <ChartAreaInteractive data={enrollmentData} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Course</h2>
          <Link href="/admin/courses" className={buttonVariants({ variant: "outline" })} >View All Course</Link>
        </div>
        <Suspense fallback={<RenderRecentCourseSkeleton />}>
          <RenderRecentCourse />
        </Suspense>
      </div>

    </>
  )
}


async function RenderRecentCourse() {
  const recetCourses = await getAdminRecentCourses();

  if (recetCourses.length === 0) {
    return (
      <EmptyState
        title='You don&apos;t have any recent course'
        description='You don&apos;t have any course. create some to see them here'
        buttonText='Create Course'
        href='/admin/courses/create' />
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
      {
        recetCourses.map((course) => {
          return <AdminCourseCard key={course.id} data={course} />
        })
      }
    </div>
  )
}

function RenderRecentCourseSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
      {
        Array.from({ length: 2 }).map((_, index) => {
          return <AdminCourseCardSkeleton key={index} />
        })
      }
    </div>
  )
}