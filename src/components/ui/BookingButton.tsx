import type { ReactNode } from "react";
import Button, { type ButtonAsLink } from "@/components/ui/Button";
import { BOOKING_HREF } from "@/lib/site";

type BookingButtonProps = Omit<ButtonAsLink, "href" | "children"> & {
  children?: ReactNode;
};

export default function BookingButton({ children = "Boka tid", ...props }: BookingButtonProps) {
  return (
    <Button href={BOOKING_HREF} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </Button>
  );
}
