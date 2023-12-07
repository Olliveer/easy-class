"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";

import { FileUpload } from "@/components/file-upload";

interface ChapterVideoProps {
  initialData: Chapter & {
    muxData?: MuxData | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string(),
});

function ChapterVideoForm({
  courseId,
  initialData,
  chapterId,
}: ChapterVideoProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isEditing, setisEditing] = useState(false);

  const toggleEdit = () => setisEditing(!isEditing);

  const handleSubmitVideo = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast({
        title: "Success",
        description: "Chapter video updated",
      });
      toggleEdit();
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
        >
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData.muxData?.playbackId || ""}
              // metadata={}
            />
          </div>
        )
      ) : null}
      {isEditing ? (
        <div className="">
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                handleSubmitVideo({ videoUrl: url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video.
          </div>
        </div>
      ) : null}
      {initialData.videoUrl && !isEditing ? (
        <div className="text-sm text-muted-foreground mt-2">
          Video can take a few minutes to process. If you just uploaded it,
          please wait a few minutes before refreshing the page.
        </div>
      ) : null}
    </div>
  );
}

export default ChapterVideoForm;
