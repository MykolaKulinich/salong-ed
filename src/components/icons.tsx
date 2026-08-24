type IconProps = {
  className?: string;
};

function Icon({ className = "h-6 w-6", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>;
}

export function CloseIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M6 6l12 12M18 6 6 18" /></Icon>;
}

export function ArrowRightIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M4 12h16M14 6l6 6-6 6" /></Icon>;
}

export function ArrowDownIcon({ className }: IconProps) {
  return <Icon className={className}><path d="m6 9 6 6 6-6" /></Icon>;
}

export function CameraIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M4 8h3l1.8-2.2a1 1 0 0 1 .8-.5h4.8a1 1 0 0 1 .8.5L17 8h3v11H4V8Z" /><circle cx="12" cy="13" r="3.3" /></Icon>;
}

export function SparkleIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M12 3.5 13.8 9l5.2 1.8-5.2 1.8L12 18l-1.8-5.4L5 10.8 10.2 9 12 3.5Z" /></Icon>;
}

export function PersonIcon({ className }: IconProps) {
  return <Icon className={className}><circle cx="12" cy="8" r="3.2" /><path d="M5 20c0-3.7 3.1-6 7-6s7 2.3 7 6" /></Icon>;
}

export function ShieldCheckIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M12 3.5 18.5 6v5.5c0 4.4-2.8 7.6-6.5 9-3.7-1.4-6.5-4.6-6.5-9V6L12 3.5Z" /><path d="m9 12.2 2 2 3.8-4" /></Icon>;
}

export function CalendarCheckIcon({ className }: IconProps) {
  return <Icon className={className}><rect x="4" y="5.5" width="16" height="14" rx="1.2" /><path d="M4 10h16M8 3.5v3M16 3.5v3M9 14.3l1.8 1.8 4.7-3.6" /></Icon>;
}

export function LocationIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M19 10.2c0 4.7-7 10.3-7 10.3S5 14.9 5 10.2a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></Icon>;
}

export function PhoneIcon({ className }: IconProps) {
  return <Icon className={className}><path d="M7.2 4.5 5.5 6.1c-.8.8.1 4.5 3.2 7.6s6.8 4 7.6 3.2l1.6-1.7-2.7-2.7-1.8 1.1a15.4 15.4 0 0 1-4.6-4.6l1.1-1.8-2.7-2.7Z" /></Icon>;
}

export function MailIcon({ className }: IconProps) {
  return <Icon className={className}><rect x="3.5" y="5.5" width="17" height="13" rx="1.2" /><path d="m4 7 8 6 8-6" /></Icon>;
}

export function CheckIcon({ className }: IconProps) {
  return <Icon className={className}><path d="m5 12.5 4.2 4.2L19 7" /></Icon>;
}
