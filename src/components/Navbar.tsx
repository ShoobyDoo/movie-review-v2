import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Film, ChevronDown, User as UserIcon, LogOut } from "lucide-react";
import Button from "./Button";
import type { NavbarProps } from "../types/navbar";

const Navbar = ({ user = null, onLogout, scrollContainerRef }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current ?? window;

    const handleScroll = () => {
      if (scrollContainerRef?.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 10);
      } else {
        setIsScrolled(window.scrollY > 10);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "px-4 pt-2" : ""
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-300 ${
          isScrolled
            ? "bg-background/50 backdrop-blur-xl rounded-2xl px-4 sm:px-6 lg:px-8"
            : "px-4 sm:px-6 lg:px-8"
        }`}
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="CineReview - Go to homepage"
          >
            <Film className="size-6 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              Cine<span className="text-primary">Review</span>
            </span>
          </Link>

          {/* Right side - Auth buttons or Profile */}
          <div className="flex items-center gap-3">
            {user ? (
              <div
                ref={dropdownRef}
                className="relative"
                onKeyDown={handleKeyDown}
              >
                <button
                  type="button"
                  onClick={handleToggleDropdown}
                  className="flex items-center gap-2 rounded-full p-1 transition-all hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Open user menu"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="size-9 rounded-full object-cover ring-2 ring-primary/30"
                    />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-primary/30">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg border border-border bg-popover/95 p-2 shadow-xl shadow-black/20 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    {/* User Info */}
                    <div className="border-b border-border px-3 py-3">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary/70 focus-visible:bg-secondary/70 focus-visible:outline-none"
                        role="menuitem"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        <UserIcon />
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus-visible:bg-destructive/10 focus-visible:outline-none"
                        role="menuitem"
                      >
                        <LogOut className="size-5" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button type="link" href="/login" variant="secondary" size="sm">
                  Log in
                </Button>
                <Button type="link" href="/register" size="sm">
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
