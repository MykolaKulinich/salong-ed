import type { ReactNode } from "react";

type ContainerTag = "div" | "section" | "nav" | "main";

type ContainerProps = {
  as?: ContainerTag;
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Shared content wrapper: centers content, caps it at the desktop max
 * width, and applies consistent horizontal page padding.
 */
export default function Container({
  as: Tag = "div",
  id,
  className = "",
  children,
}: ContainerProps) {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-10 ${className}`}>
      {children}
    </Tag>
  );
}
