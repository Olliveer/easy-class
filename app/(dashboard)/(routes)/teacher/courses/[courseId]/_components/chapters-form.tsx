"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";

interface ChapterFormProps {
  initialData: Course & {
    chapters: Chapter[];
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

function ChapterForm({ initialData, courseId }: ChapterFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreating, setisCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => setisCreating(!isCreating);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleSubmitTitle = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast({
        title: "Success",
        description: "Course chapter created",
      });
      toggleCreating();
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
        Course chapters
        <Button
          variant={"ghost"}
          onClick={toggleCreating}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Edit a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitTitle)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="chapter"
                      placeholder="e.g. Introduction to the course..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating ? (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters?.length ? "text-slate-500 italic" : null
          )}
        >
          {!initialData.chapters?.length ? "No chapters yet." : null}
          {/* TODO: ADD CHAPTERS HERE */}
        </div>
      ) : null}
      {!isCreating ? (
        <p className="text-sm text-muted-foreground mt-4">
          Drag and drop to reorder chapters. Click on a chapter to edit it.
        </p>
      ) : null}
    </div>
  );
}

export default ChapterForm;
