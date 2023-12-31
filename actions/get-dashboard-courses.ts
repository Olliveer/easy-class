import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type DashboardCourses = {
  completedCourses: CourseWithProgressAndCategory[];
  coursesInProgress: CourseWithProgressAndCategory[];
};

type CourseWithProgressAndCategory = Course & {
  progress: number | null;
  category: Category;
  chapters: Chapter[];
  id: string;
};

export async function getDashboardCourses(
  userId: string
): Promise<DashboardCourses> {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchasedCourse) => purchasedCourse.course
    ) as CourseWithProgressAndCategory[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);

      course["progress"] = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES_ERROR]", error);

    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
}
