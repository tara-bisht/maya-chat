import type { ReactElement, SVGProps } from "react";
import type { AppNavId } from "@/lib/ui-copy";

type IconProps = SVGProps<SVGSVGElement>;

function iconProps(props: IconProps): IconProps {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function ExploreIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9.2 14.8 1.4-4.2 4.2-1.4-1.4 4.2z" />
    </svg>
  );
}

export function CreateIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.4 19.2a6.6 6.6 0 0 1 13.2 0" />
    </svg>
  );
}

export function SignOutIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3" />
      <path d="M10 12h9" />
      <path d="m16 8 4 4-4 4" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function PlanIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 8h12v11H6z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

export function AgentsIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  );
}

export const NAV_ICONS: Record<AppNavId, (props: IconProps) => ReactElement> = {
  home: HomeIcon,
  explore: ExploreIcon,
  create: CreateIcon,
  profile: ProfileIcon,
};
