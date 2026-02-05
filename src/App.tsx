import { Film, MessageCircle, Star, TrendingUp } from "lucide-react";
import InfoCard from "./components/InfoCard";
import Button from "./components/Button";

export const meta = () => {
  return [
    { title: "CineReview - Your Voice in Cinema" },
    {
      name: "description",
      content: "Discover, review, and discuss the films that move you.",
    },
  ];
};

const App = () => {
  return (
    <>
      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 p-4 backdrop-blur-sm border border-primary/20">
                  <Film className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-7xl font-bold text-balance leading-tight">
                  <span className="bg-linear-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                    Your Voice in Cinema
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
                  Discover, review, and discuss the films that move you. Join a
                  community of passionate film enthusiasts.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Button type="link" href="/reviews" size="lg">
                  See reviews
                </Button>
                <Button
                  type="link"
                  href="/register"
                  size="lg"
                  variant="secondary"
                >
                  Get started
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-foreground">
                Why CineReview?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <InfoCard
                  highlighted
                  icon={Star}
                  title="Rate & Review"
                  description="Share your thoughts on films with detailed reviews and star ratings"
                />

                <InfoCard
                  highlighted
                  icon={MessageCircle}
                  title="Engage"
                  description="Join conversations with fellow movie lovers through comments and discussions"
                />

                <InfoCard
                  highlighted
                  icon={TrendingUp}
                  title="Discover"
                  description="Find your next favorite film through personalized recommendations"
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(120,255,200,0.08),transparent_60%)]" />

            <div className="relative max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Ready to Share Your Perspective?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Join thousands of film enthusiasts already sharing their reviews
              </p>
              <Button type="link" href="/register" size="lg">
                Create free account
              </Button>
            </div>
          </section>
        </main>

        <footer className="border-t border-border/50 py-8 px-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CineReview. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
