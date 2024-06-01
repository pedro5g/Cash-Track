import { NavBar } from "@/components/header/nav-bar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" relative flex flex-col w-full h-screen">
      <NavBar />
      <div className="w-full">{children}</div>
    </div>
  );
}
