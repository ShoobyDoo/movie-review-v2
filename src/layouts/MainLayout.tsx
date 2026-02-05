import { Outlet } from "react-router";
import { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  // TODO: Wire up auth state here
  // const user = useAuth();
  // const handleLogout = () => { ... };

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar scrollContainerRef={mainRef} />
      <main ref={mainRef} className="flex-1 overflow-y-auto mt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
