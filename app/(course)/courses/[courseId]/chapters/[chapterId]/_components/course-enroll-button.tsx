"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type CourseEnrollButtonProps = {
  courseId: string;
  price: number;
};

function CourseEnrollButton({ courseId, price }: CourseEnrollButtonProps) {
  return (
    <Button
      className="w-full md:w-auto"
      size={"sm"}
    >
      Enroll for {formatCurrency(price)}
    </Button>
  );
}

export default CourseEnrollButton;
