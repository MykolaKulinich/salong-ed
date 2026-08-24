import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";
export type ButtonSize = "md" | "sm";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: never;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:pointer-events-none disabled:opacity-50";

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  sm: "px-5 py-2.5 text-xs sm:text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-accent-strong",
  secondary:
    "border border-foreground/25 text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
  // For use on dark/inverted sections (e.g. the treatment-guide preview).
  inverse: "border border-background/40 text-background hover:bg-background hover:text-foreground",
  // Text-only, no border/fill — for a CTA that should read as clearly
  // lighter/secondary next to a primary button (e.g. the hero).
  ghost: "text-foreground/75 hover:text-accent",
};

function isLinkProps(props: ButtonProps): props is ButtonAsLink {
  return typeof props.href === "string";
}

/**
 * Renders a Next.js Link when `href` is provided, otherwise a native
 * button — so the same visual variants work for navigation CTAs and
 * future form actions alike.
 */
export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (isLinkProps(props)) {
    const { variant: _variant, size: _size, className: _className, children: _children, ...rest } = props;
    void _variant;
    void _size;
    void _className;
    void _children;
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _variant, size: _size, className: _className, children: _children, ...rest } = props;
  void _variant;
  void _size;
  void _className;
  void _children;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
