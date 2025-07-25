import { Navbar } from "@components/navbar";
import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if(session?.user) {
    redirect('/dashboard');
  } else {
    redirect('/api/auth/signin');
  }

  return (
    <main className="flex flex-col w-full">
      <div>
        <Navbar  />
      </div>
    </main>
  );
}
