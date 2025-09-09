

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseSchema, CourseSchemaType } from '@/lib/zodSchemas'

import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import CreateCourseForm from './_components/create-course-form'
const Page = () => {

    return (
        <>
            <div className='flex items-center gap-4'>
                <Link href={"/admin/courses"} className={buttonVariants({ variant: "outline", size: "icon" })}>
                    <ArrowLeftIcon className='size-4' />
                </Link>
                <h1 className='text-2xl font-bold '>Create Courses</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide basic information abouut the course</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateCourseForm />
                </CardContent>
            </Card>
        </>
    )
}

export default Page
