"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CourseActionsProps = {
  courseId: string;
  disabled: boolean;
  isPublished: boolean;
};

function CourseActions({
  courseId,
  disabled,
  isPublished,
}: CourseActionsProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleOnPublish() {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast({
          title: "Course unpublished",
          description: "The course has been unpublished.",
        });
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast({
          title: "Course published",
          description: "The course has been published.",
        });
        confetti.toggleConfetti();
      }

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast({
        title: "Course deleted",
        description: "The course has been deleted.",
      });
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2 ">
      <Button
        onClick={handleOnPublish}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button
          size={"sm"}
          variant={"destructive"}
          disabled={isLoading}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default CourseActions;
