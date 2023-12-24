import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./course-sidebar-item";

type CourseSidebarProps = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

async function CourseSidebar({ course, progressCount }: CourseSidebarProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {/* check purchase */}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <>
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              chapter={chapter}
              courseId={course.id}
              isLocked={!purchase && !chapter.isFree}
              isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            />
          </>
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
