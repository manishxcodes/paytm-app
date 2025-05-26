"use client"

import { cn } from "@repo/ui/lib/utils"
import { Button } from "@repo/ui/components/shadcn/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/shadcn/card"
import { Input } from "@repo/ui/components/shadcn/input"
import { Label } from "@repo/ui/components/shadcn/label"
import { useState } from "react"
import { number } from "zod/v4"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/components/shadcn/input-otp"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");
  const [resendCountdown, setResendCountDown] = useState(45);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(email, password, firstName, lastName, phoneNumber, otp);
    if(step === "details") {
        console.log("step change", step);
        setStep("otp");
        resendTimer();
        // send otp 
    }

    // do zod validation 

    // send otp to user email

    // if all ok create account
  }

  async function handleResend() {
    resendTimer();
  }

  function resendTimer() {
    setResendCountDown(45);
    const timer = setInterval(() => {
        setResendCountDown((prev) => {
            if(prev <= 1) {
                clearInterval(timer);
                return 0;
            }
            return prev - 1;
        })
    }, 1000);
  }

  function handleStep() {
    console.log('step change,', step)
    if(step == "details" ) {
        setStep("otp");
    } else {
        setStep("details");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            { step === "details" 
                ? "Create a new account" : "Check your email account"
            }
        </CardTitle>
          <CardDescription>
            { step === "details" 
                ? "Enter your credentials to create your account" :`We've sent you a verification code to email account`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === "details" ? (
                <>
                    <div className="flex flex-col gap-6">
                    <div className="flex gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">FirstName</Label>
                            <Input className="text-sm placeholder-gray-400 focus:placeholder-transparent"
                            id="firstName"
                            type="text"
                            placeholder="John"
                            required
                            value={firstName}
                            onChange={(e) => {setFirstName(e.target.value)}}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">LastName</Label>
                            <Input className="text-sm placeholder-gray-400 focus:placeholder-transparent"
                            id="lastName"
                            type="text"
                            placeholder="Cena"
                            required
                            value={lastName}
                            onChange={(e) => {setLastName(e.target.value)}}
                            />
                        </div>
                    </div>  
                    <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Phone</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">+91</span>
                            <Input className="text-sm placeholder-gray-400 focus:placeholder-transparent"
                            id="phoneNumber"
                            type="text"
                            placeholder="9191939495"
                            required
                            value={phoneNumber}
                            onChange={(e) => {setPhoneNumber("+91" + e.target.value)}}
                            />
                        </div>
                        
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input className="text-sm placeholder-gray-400 focus:placeholder-transparent"
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        </div>
                        <Input className="text-sm placeholder-gray-400 focus:placeholder-transparent"
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        placeholder="Password must be of 8 digits"
                        onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full" onClick={handleSubmit}>
                        Sent OTP
                        </Button>
                    </div>
                    </div>
                    <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <a href="/auth/signin" className="underline underline-offset-4">
                        Sign In
                    </a>
                    </div>
                </>
                ) : (
                    <>
                        <div className="flex flex-col gap-6"> 
                        <div className="grid gap-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <div className="space-y-2 flex items-center justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => setOtp(value)}
                            >
                                <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                            <div className="flex-3 gap-2">
                                <p className="text-sm">Haven't received OTP yet?</p>
                                {resendCountdown > 0 &&
                                (<p className="text-sm">Try again in {resendCountdown}</p>)
                                }
                            </div>
                            <div className="flex-1 gap-2">
                                {resendCountdown == 0 && 
                                <Button variant={"outline"} size={"sm"}
                                    onClick={handleResend}>Resend</Button>}
                            </div>
                        </div> 
                        </div>

                        
                        <div className="flex  gap-3">
                            <Button variant={"outline"} className="flex-1/2" onClick={handleStep}>Go Back</Button>
                            <Button type="submit" className="flex-1/2" onClick={handleSubmit}>
                            Create Account
                            </Button>
                        </div>
                        </div>                  
                    </>
                )
            }

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
