type AuthDividerProps = {
  text?: string;
};

const AuthDivider = ({ text = "or" }: AuthDividerProps) => {
  return (
    <div className="my-5 flex items-center gap-4">
      <div className="h-px flex-1 bg-border" />
      <span className="text-sm text-muted-foreground">{text}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
};

export default AuthDivider;
