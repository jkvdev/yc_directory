import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, Github, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        {/* Navbar Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              {/* Create Link */}
              <Link href="/startup/create">
                <span className="max-sm:hidden font-semibold">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              {/* Logout Button */}
              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="flex gap-2 items-center text-primary"
                >
                  <span className="max-sm:hidden font-semibold">Logout</span>
                  <LogOut className="size-6 sm:hidden" />
                </button>
              </form>

              {/* User Name & Avatar */}
              <Link
                className="flex gap-5 items-center justify-center"
                href={`/user/${session?.id}`}
              >
                {/* Username */}
                <span className="max-lg:hidden font-semibold">
                  {session?.user?.name}
                </span>

                {/* Avatar */}
                <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            // Login Button
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <button
                type="submit"
                className="font-semibold p-3 py-2 border-[3px] border-black rounded-sm flex gap-2 items-center justify-center shadow-none hover:shadow-100 transition-all duration-150"
              >
                <Github className="size-5" />
                Login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
