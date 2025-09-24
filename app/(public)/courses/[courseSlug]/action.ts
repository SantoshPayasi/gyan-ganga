"use server"

import { requireUser } from "@/app/data/user/require-user";
import { Arcjet, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { warnEnvConflicts } from "@/lib/generated/prisma/runtime/library";
import { stripe } from "@/lib/stripe";
import { APiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";


const aj = Arcjet.withRule(
    fixedWindow({
        mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        window: "1m",
        max: 5,
    })
)

export async function enrollInCourseAction(courseId: string): Promise<APiResponse | never> {
    const user = await requireUser();
    let checkouturl: string;
    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.id
        })

        if (decision.isDenied()) {
            return {
                status: 'error',
                message: "You have been blocked"
            }
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                id: true,
                price: true,
                slug: true,
                title: true,
                sripePriceId: true
            }
        })

        if (!course) {
            return {
                status: 'error',
                message: "Course not found"
            }
        }

        let stripeCusotmerId: string;

        const iscustomer = await prisma.user.findUnique({
            where: {
                email: user.id
            },
            select: {
                stripeCustomerId: true
            }
        })

        if (iscustomer?.stripeCustomerId) {
            stripeCusotmerId = iscustomer.stripeCustomerId;
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id
                }
            })

            stripeCusotmerId = customer.id;
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    stripeCustomerId: stripeCusotmerId
                }
            })

        }


        const result = await prisma.$transaction(async (tx) => {
            const existingEnrollment = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: course.id
                    }
                },
                select: {
                    status: true,
                    id: true
                }
            })

            if (existingEnrollment?.status === 'Active') {
                return {
                    status: 'success',
                    message: "You are already enrolled in this course"
                }
            }

            let enrollment;

            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id
                    },
                    data: {
                        amount: course.price,
                        status: "Pending",
                        updatedAt: new Date()
                    }
                })
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price,
                        status: "Pending"
                    }
                })
            }


            const checkoutSession = await stripe.checkout.sessions.create({
                customer: stripeCusotmerId,
                line_items: [
                    {
                        price: course.sripePriceId,
                        quantity: 1
                    }
                ],
                mode: "payment",
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id
                }

            })


            return {
                enrollment: enrollment,
                checkouturl: checkoutSession.url
            }

        })

        checkouturl = result.checkouturl as string;

    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            return {
                status: "error",
                message: "Payment system error, please try after some time"
            }
        }
        return {
            status: 'error',
            message: "Unable to enroll in course"
        }
    }

    redirect(checkouturl);
}