import { HouseHeader } from "@/components/app/house-header";

export default function SettingsLayout({
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
