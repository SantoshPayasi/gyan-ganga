import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/public/logo.png"
import Image from "next/image";
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link href={"/"} className={buttonVariants(
                {
                    variant: "outline",
                    className: "absolute top-4 left-4"
                }
            )}>
                <ArrowLeftIcon className="size-4" />
                <span>Back</span>
            </Link>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link className="flex items-center gap-2 self-center font-medium" href={"/"}>
                    <Image src={Logo} alt="Logo" width={32} height={32} />
                    GyanGanga
                </Link>
                {children}
                <div className="text-balance text-center text-xs text-muted-foreground" >
                    By clicking continue, you agree to our <span className="hover:text-primary hover:underline cursor-pointer">Terms of services</span>{" "}
                    and <span className="hover:text-primary hover:underline cursor-pointer">Privacy Policy</span>.</div>
            </div>
        </div>
    )
}