import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

type CourseProgressProps = {
  variant?: "default" | "success";
  size?: "default" | "sm";
  value: number;
};

const colorByVariant = {
  default: "text-gray-200",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

function CourseProgress({ variant, size, value }: CourseProgressProps) {
  return (
    <div>
      <Progress
        className="h-2"
        value={value}
        variant={variant}
      />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
}

export default CourseProgress;
