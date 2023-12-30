"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";

type CourseEnrollButtonProps = {
  courseId: string;
  price: number;
};

function CourseEnrollButton({ courseId, price }: CourseEnrollButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);

      window.location.assign(response.data.url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full md:w-auto"
      size={"sm"}
      onClick={handleClick}
      disabled={isLoading}
    >
      Enroll for {formatCurrency(price)}
    </Button>
  );
}

export default CourseEnrollButton;
