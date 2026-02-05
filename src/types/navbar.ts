interface UserData {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface NavbarProps {
  user?: UserData | null;
  onLogout?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}
