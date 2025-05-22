import { Card } from "@repo/ui/card";

import { prisma } from "@repo/db";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <div className="z-10 items-center justify-between w-full max-w-5xl font-mono text-sm lg:flex">
        hello there, this is user app
      </div>
      <Card title={"Yo"}
        children={<button>Gurt</button>}
        href={"click here"} />


    </main>
  );
}
