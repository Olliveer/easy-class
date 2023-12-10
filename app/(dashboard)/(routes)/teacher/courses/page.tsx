import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Course } from "@prisma/client";

async function getData(userId: string): Promise<Course[]> {
  const courses = await db.course.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      price: true,
      isPublished: true,
      createdAt: true,
    },
  });

  return courses as Course[];
}

async function Courses() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const data = await getData(userId);

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  );
}

export default Courses;
