import { HouseHeader } from "@/components/app/house-header";

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HouseHeader />
      {children}
    </>
  );
}
