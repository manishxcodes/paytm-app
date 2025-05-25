import { LoginForm } from "@components/login-form";

export default function SignIn() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-full flex items-center justify-center">
                <div className="bg-black w-96">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}