import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";

type CourseWithProgressWithCategory = Course & {
  category?: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type CoursesListProps = {
  items: CourseWithProgressWithCategory[];
};

function CoursesList({ items }: CoursesListProps) {
  return (
    <div className="">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            id={course.id}
            imageUrl={course.imageUrl!}
            chaptersLength={course.chapters.length}
            price={course.price!}
            progress={course.progress}
            category={course?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  );
}

export default CoursesList;
