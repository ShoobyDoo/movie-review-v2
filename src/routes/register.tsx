import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import AuthDivider from "../components/AuthDivider";
import Input from "../components/Input";
import Button from "../components/Button";
import BackButton from "../components/BackButton";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // TODO: Show error toast
      console.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // TODO: Implement actual registration logic
    console.log("Register attempt:", { name, email, password });

    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join the CineReview community"
    >
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Your name"
          required
          autoComplete="name"
        />

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
          placeholder="Create a password"
          required
          autoComplete="new-password"
        />

        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
        />

        <Button type="submit" disabled={isLoading} className="w-full" size="md">
          {isLoading ? "Creating account..." : "Create account"}
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
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
