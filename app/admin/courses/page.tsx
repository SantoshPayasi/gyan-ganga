import { getAdminCourses } from '@/app/data/admin/admin-get-courses'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { AdminCourseCard, AdminCourseCardSkeleton } from './_components/admin-course-card';
import { EmptyState } from '@/components/general/EmptyState';

export default function CoursesPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Your Courses</h1>
                <Link className={buttonVariants()} href={'/admin/courses/create'}>Create Course</Link>
            </div>
            <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
                <RenderCourses />
            </Suspense>

        </>
    )
}


async function RenderCourses() {
    const data = await getAdminCourses();

    return (
        <>
            {
                data.length === 0 ? (
                    <EmptyState title={"No Course Found"} description='Create a new course' buttonText='Create Course' href='/admin/courses/create' />
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-7'>
                        {
                            data.map((course) => {
                                return <AdminCourseCard key={course.id} data={course} />
                            })
                        }
                    </div>
                )
            }
        </>
    )

}


function AdminCourseCardSkeletonLayout() {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7'>

            {
                Array.from({ length: 4 }).map((_, index) => {
                    return <AdminCourseCardSkeleton key={index} />
                })
            }
        </div>
    )
}





