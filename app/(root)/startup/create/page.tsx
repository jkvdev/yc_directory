import StartupForm from "@/components/StartupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  // Get Auth Session
  const session = await auth();

  // If no Auth session, redirect to the homepage
  if (!session) redirect("/");

  return (
    <>
      {/* Header Section */}
      <section className="pink_container !min-h-[230px]">
        {/* Heading */}
        <h1 className="heading">Submit Your Startup</h1>
      </section>

      <StartupForm />
    </>
  );
};

export default Page;
