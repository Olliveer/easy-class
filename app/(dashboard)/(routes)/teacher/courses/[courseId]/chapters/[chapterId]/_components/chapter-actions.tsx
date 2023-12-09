"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ChapterActionsProps = {
  courseId: string;
  chapterId: string;
  disabled: boolean;
  isPublished: boolean;
};

function ChapterActions({
  chapterId,
  courseId,
  disabled,
  isPublished,
}: ChapterActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleOnPublish() {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast({
          title: "Chapter unpublished",
          description: "The chapter has been unpublished.",
        });
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast({
          title: "Chapter published",
          description: "The chapter has been published.",
        });
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

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

      toast({
        title: "Chapter deleted",
        description: "The chapter has been deleted.",
      });
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
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

export default ChapterActions;
