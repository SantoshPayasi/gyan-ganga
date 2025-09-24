import { EmptyState } from "@/components/general/EmptyState"
import { getAllCourses } from "../data/course/get-all-courses"
import { getEnrolledCourses } from "../data/user/get-enrolled-courses"
import { AdminCourseCard } from "../admin/courses/_components/admin-course-card"
import { PublicCourseCard } from "../(public)/courses/_components/public-course-card"
import Link from "next/link"
import { EnrolledCourseCard } from "./_components/course-progress-card"

export default async function DashboardPage() {
  const [allCourses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses()
  ])
  return (
    <>
      <div className="flex flex:col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">Here you can see all courses you have access to</p>
      </div>
      {
        enrolledCourses.length === 0 ? (
          <EmptyState title='You don&apos;t have any enrolled course' description='You don&apos;t have any course. create some to see them here' buttonText='Create Course' href='/courses/create' />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
              enrolledCourses.map((course) => {
                return <EnrolledCourseCard key={course.id} data={course} />
              })
            }
          </div>
        )
      }

      <section className="mt-10 mb-5">
        <div className="flex flex:col gap-2">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">Here you can see all courses you can purchase</p>
        </div>
        {
          allCourses.filter((course) => !enrolledCourses.some((enrolledCourse) => enrolledCourse.id === course.id)).length === 0 ? (
            <EmptyState title='You don&apos;t have any available course' description='You have already purchased all available courses' buttonText='Create Course' href='/courses/create' />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {
                allCourses.filter((course) => !enrolledCourses.some((enrolledCourse) => enrolledCourse.id === course.id)).map((course) => {
                  return <AdminCourseCard key={course.id} data={course} />
                })
              }
            </div>
          )
        }
      </section>
    </>
  )
}