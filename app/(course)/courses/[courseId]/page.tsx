import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

async function CoursePage({ params }: { params: { courseId: string } }) {
  const couse = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!couse) {
    return notFound();
  }

  return redirect(
    `/courses/${params.courseId}/chapters/${couse.chapters[0].id}`
  );
}

export default CoursePage;
