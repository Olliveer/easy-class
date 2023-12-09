import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 text-primary border-yellow-30",
        success: "bg-emerald-700 text-secondary border-emerald-800",
      },
      defaultVariants: {
        default: "warning",
      },
    },
  }
);

type BannerProps = VariantProps<typeof bannerVariants> & {
  label: string;
};

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

function Banner({ variant, label }: BannerProps) {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" /> {label}
    </div>
  );
}

export default Banner;
