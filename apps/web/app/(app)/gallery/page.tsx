import { redirect } from "next/navigation";
import { MAYA_HOME_HREF } from "@maya/shared";

export default function GalleryPage() {
  redirect(MAYA_HOME_HREF);
}
