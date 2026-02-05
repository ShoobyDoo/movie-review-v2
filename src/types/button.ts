interface ButtonBaseProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface ButtonAsButton extends ButtonBaseProps {
  type?: "button" | "submit" | "reset";
  href?: never;
  onClick?: () => void;
}

interface ButtonAsLink extends ButtonBaseProps {
  type: "link";
  href: string;
  onClick?: never;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;
