import { HouseHeader } from "@/components/app/house-header";

export default function GalleryLayout({
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
