import type { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="group relative overflow-hidden flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-card/50 border-2 border-border backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="relative text-xl font-semibold text-card-foreground">
        {title}
      </h3>
      <p className="relative text-muted-foreground leading-relaxed text-pretty">
        {description}
      </p>
    </div>
  );
};

export default InfoCard;
