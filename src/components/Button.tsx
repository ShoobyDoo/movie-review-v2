import { Link } from "react-router";
import type { ButtonProps } from "../types/button";

const sizeClasses = {
  sm: "text-sm px-4 h-9",
  md: "text-base px-6 h-10",
  lg: "text-base px-8 h-12",
} as const;

const variantClasses = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-input",
} as const;

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-md font-semibold";

const isExternalUrl = (href: string): boolean => {
  return href.startsWith("http://") || href.startsWith("https://");
};

const Button = ({
  size = "md",
  variant = "primary",
  children,
  className = "",
  disabled = false,
  ...props
}: ButtonProps) => {
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (props.type === "link") {
    const { href } = props;

    if (isExternalUrl(href)) {
      return (
        <a
          href={href}
          className={combinedClasses}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={typeof children === "string" ? children : undefined}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        to={href}
        className={combinedClasses}
        aria-label={typeof children === "string" ? children : undefined}
      >
        {children}
      </Link>
    );
  }

  const { type = "button", onClick } = props;

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
