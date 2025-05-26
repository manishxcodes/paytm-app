"use client"

import { Container } from "@repo/ui/components/container"
import { Button } from "@repo/ui/components/shadcn/button"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function Navbar() {
  return (
    <div className="bg-background shadow-accent-foreground">
        <Container>
            <div className="flex items-center justify-between py-4">
            <div className="font-semibold">PayTm </div>
                <div className="flex gap-4">
                    <Button size={"sm"} variant={"outline"} 
                        onClick={() => {signIn()}}>Sign In</Button>
                    <Link href={"/auth/signup"}>
                        <Button className="bg-accent hover:bg-accent/70 hover:scale-95 text-accent-foreground transition-all duration-150" size={"sm"}
                    >Register</Button>
                    </Link>
                </div>

                {/* make simple navbar using login only and for signup we can do in cta */}
            </div>
        </Container>
    </div>
  )
}
