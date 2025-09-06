"use client"

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


export default function Home() {
  const { data: session } = authClient.useSession()
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        }
      }
    })
  }
  return (
    <div>

      <ThemeToggle />

      {session ?
        <div>
          <p>Signed in as {session.user.name}</p>
          <Button onClick={signOut}>Sign Out</Button>
        </div>
        :
        <Button>Sign in</Button>
      }
    </div>
  );
}
