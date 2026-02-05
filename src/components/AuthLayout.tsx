import { Link } from "react-router";
import { Film } from "lucide-react";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,255,200,0.08),transparent_50%)]" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
        {/* Logo and brand */}
        <Link
          to="/"
          className="mb-6 flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="CineReview - Go to homepage"
        >
          <Film className="size-7 text-primary" />
          <span className="text-2xl font-bold text-foreground">
            Cine<span className="text-primary">Review</span>
          </span>
        </Link>

        {/* Auth card */}
        <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
