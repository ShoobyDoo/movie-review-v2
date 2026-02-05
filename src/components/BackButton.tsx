import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    void navigate(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleGoBack();
    }
  };

  return (
    <button
      onClick={handleGoBack}
      onKeyDown={handleKeyDown}
      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md px-2 py-1"
      aria-label="Go back to previous page"
      tabIndex={0}
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      <span className="font-medium">Go back</span>
    </button>
  );
};

export default BackButton;
