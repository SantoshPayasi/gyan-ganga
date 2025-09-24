import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";


interface FeatureProps {
    title: string;
    description: string;
    icon: string;
}

const features: FeatureProps[] = [
    {
        title: "Comprehensive Course Catalog",
        description: "Explore a wide range of courses across various subjects, from technology and business to arts and humanities.",
        icon: "📚"
    },
    {
        title: "Interactive Learning",
        description: "Engage with interactive content, quizzes, and assignments to enhance your understanding and retention of knowledge.",
        icon: "🧩"
    },
    {
        title: "Progress Tracking",
        description: "Monitor your learning journey with progress tracking features that help you stay motivated and on track.",
        icon: "📈"
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of learners and educators to share insights, ask questions, and collaborate on projects.",
        icon: "🤝"
    }
]
export default function Home() {
    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Badge variant={"outline"}>
                        The Future of Online Education
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Elevate your learning Experience</h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">Discover a world of knowledge and insights with our cutting-edge online learning platform. Unleash your potential and unlock a new level of knowledge.Access high quality courses any time, anywhere.</p>
                    <div className="flex flex-col sm:flex-row mt-8 gap-4">
                        <Link href={"/courses"} className={buttonVariants({ size: "lg" })}>
                            Explore Courses
                        </Link>
                        <Link href={"/login"} className={buttonVariants({ size: "lg", variant: "outline" })}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                {
                    features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    )
                    )
                }
            </section>
        </>
    );
}
