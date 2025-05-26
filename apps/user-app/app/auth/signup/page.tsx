import { LoginForm } from "@components/login-form";
import { SignupForm } from "@components/signup-form";

export default function SignUp() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-full flex items-center justify-center">
                <div className="bg-black w-96">
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}