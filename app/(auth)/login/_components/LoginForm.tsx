"use client";


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { GithubIcon, Loader, MailIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner';

const LoginForm = () => {
    const router = useRouter();
    const [githubPending, startGithubTransaction] = useTransition()
    const [emailPending, startEmailTransaction] = useTransition()
    const [email, setEmail] = useState("")
    async function signInWithGitHub() {
        startGithubTransaction(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Signed in with Github, you will be redirected...');
                        router.push("/")
                    },
                    onError: (error) => {
                        toast.error(error.error.message);
                    }
                }
            })
        })
    }


    function signInwithEmail() {
        startEmailTransaction(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Verification OTP sent to your email, please check your inbox')
                        router.push(`/verify-request?email=${email}`)
                    },
                    onError: (error) => {
                        toast.error(error.error.message);
                    }
                }
            })
        }
        )
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle >Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent className="fle flex-col gap-4">
                <Button className="w-full" variant={"outline"} onClick={signInWithGitHub} disabled={githubPending}>
                    {githubPending ? (
                        <>
                            <Loader className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <GithubIcon className="size-4" />
                            Sign in with GitHub
                        </>
                    )}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 
                after:z-0 after:flex after:items-center after:border-t after:border-border  ">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="m@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Button onClick={signInwithEmail} disabled={emailPending}>{
                        emailPending ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <MailIcon className="size-4" />
                                Continue With Email
                            </>
                        )
                    }</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LoginForm
