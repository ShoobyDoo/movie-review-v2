import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import AuthDivider from "../components/AuthDivider";
import Input from "../components/Input";
import Button from "../components/Button";
import BackButton from "../components/BackButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual login logic
    console.log("Login attempt:", { email, password });

    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to CineReview"
    >
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          labelAction={
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          }
        />

        <Button type="submit" disabled={isLoading} className="w-full" size="md">
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <AuthDivider />

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        size="md"
        disabled
      >
        Continue with Google
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
