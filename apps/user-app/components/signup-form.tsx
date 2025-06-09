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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/components/shadcn/input-otp"
import { toast } from "sonner"
import { useState } from "react"
import { UserData, userDataSchema } from "../app/types/auth.types"
import axios from "axios"

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
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "otp">("details");
  const [resendCountdown, setResendCountDown] = useState(45);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const userData: UserData = {email, password, firstName, lastName, phoneNumber}
    // do zod validation
    const response = userDataSchema.safeParse(userData);
    if(!response.success) {
		toast.error("Invalid Credentials", {description: "Please check your credentials"})
        console.log("error");
        return;
    }

    console.log(userData, otp);

    if(step === "details") {
        console.log("step change", step);
        
        // send otp 
		try {
			setLoading(true);
			const res = await axios.post("/api/otp", {to: userData.email});
			if(res.data) {
			console.log("otp sent successfully", {data: res.data});
			toast("OTP sent successfully", {description: "Check your email"});
		}
		} catch(err) {
			toast.error("Failed to send OTP", {description: "Try again"});
			console.log("error while sending otp", {details: err});
		} finally {
			resendTimer();
			setStep("otp");
			setLoading(false);
		}
    }

    if(step === "otp") {
		try {
			setLoading(true);
			// verify otp 
			const isOtpValid = await axios.get(`/api/otp?email=${email}&otp=${otp}`);
			if(isOtpValid.status != 200) {
				toast.error("Wrong OTP", {description: "Enter the correct OTP or try again"});
				console.log("wrong otp entered");
				return;
			}
			console.log("otp valid")

   			// if all ok create account
			const response = await axios.post("/api/auth/signup", userData);
			if(response.status != 200) {
				toast.error("Failed to signup", {description: "Try again"});
				console.log("Failed to signin");
				return;
			}

			if(response.status === 200) {
				toast.success("Account Created", {description: "Signin to use the app"});
				console.log("user created", {data: response.data});
			}
		} catch(err) {
			toast.error("Error", {description: "Try again after some time"});
			console.log("Something went wrong. Try again", {details: err});
		} finally{
			setLoading(false);
		}
    }
  }

  async function handleResend() {
    resendTimer();
	try {
		setLoading(true);
		// delete previous otp
		const isOtpDeleted = await axios.delete(`/api/otp?email=${email}&otp=${otp}`);
		if(isOtpDeleted.status != 200) {
			toast.error("Something went wrong", {description: "Please try again after some time"});
			console.log("Couldnot delete OTP");
			return;
		}

    	// send new otp
		const res = await axios.post("/api/otp", {to: email});
		if(res.data) {
			console.log("otp", res.data);
			toast("OTP sent successfully", {description: "Check your email"});
		}
	} catch(err) {
		console.log("Error while deleting otp", {details: err});
		toast.error("Something went wrong", {description: "Please try again"});
		return;
	}
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
                            maxLength={10}
                            value={phoneNumber}
                            onChange={(e) => {setPhoneNumber(e.target.value)}}
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
