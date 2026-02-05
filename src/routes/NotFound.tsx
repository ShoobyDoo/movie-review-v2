import { Film, Home, Search } from "lucide-react";
import Button from "../components/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 pt-16">
      <div className="text-center">
        {/* Film reel icon with animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Film
              className="size-24 text-primary animate-pulse"
              aria-hidden="true"
            />
            <span className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground">
              ?
            </span>
          </div>
        </div>

        {/* Error code */}
        <h1 className="mb-2 text-8xl font-bold tracking-tight text-foreground">
          4<span className="text-primary">0</span>4
        </h1>

        {/* Friendly message */}
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Scene Not Found
        </h2>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          Looks like this scene ended up on the cutting room floor. The page
          you're looking for doesn't exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button type="link" href="/" size="lg">
            <Home className="size-5" aria-hidden="true" />
            Back to Home
          </Button>
          <Button type="link" href="/" variant="secondary" size="lg">
            <Search className="size-5" aria-hidden="true" />
            Search Movies
          </Button>
        </div>

        {/* Fun movie quote */}
        <p className="mt-12 text-sm italic text-muted-foreground">
          "I'll be back"... but to a different page.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
