"use client";

import { useToast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type VideoPlayerProps = {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completedOnEnd: boolean;
};

function VideoPlayer({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completedOnEnd,
}: VideoPlayerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const confetti = useConfettiStore();
  const [isReady, setIsReady] = useState(false);

  async function onEndVideo() {
    try {
      if (completedOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.toggleConfetti();
        }

        toast({
          title: "Success",
          description: "Chapter marked as completed",
        });

        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="w-8 h-8" />
          <p className="text-sm">This chapter is locked.</p>
        </div>
      )}
      {!isLocked ? (
        <MuxPlayer
          title={title}
          className={cn("", !isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEndVideo}
          autoPlay
          playbackId={playbackId}
        />
      ) : null}
    </div>
  );
}

export default VideoPlayer;
