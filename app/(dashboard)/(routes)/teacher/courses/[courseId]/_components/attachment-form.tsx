"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Plus, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & {
    attachments: Attachment[];
  };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

function AttachmentForm({ courseId, initialData }: AttachmentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isEditing, setisEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const toggleEdit = () => setisEditing(!isEditing);

  const handleSubmitAttachment = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast({
        title: "Success",
        description: "Course attachment updated",
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

  const onDelete = async (id: string) => {
    try {
      setDeleteId(id);

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast({
        title: "Success",
        description: "Course attachment deleted",
      });
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <>
          {initialData.attachments.length === 0 ? (
            <p className="text-sm italic text-slate-500">
              No attachments added yet. Add a file to make it available to your
              students.
            </p>
          ) : (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                  key={attachment.id}
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0 " />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deleteId === attachment.id && (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  )}
                  {deleteId !== attachment.id && (
                    <button
                      type="button"
                      className="ml-auto  hover:opacity-75 transition"
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
      {isEditing ? (
        <div className="">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                handleSubmitAttachment({ url: url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            Add a file to make it available to your students.
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AttachmentForm;
