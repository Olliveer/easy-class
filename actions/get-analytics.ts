import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.course.price as number;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchase = await db.purchase.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupEarnings = groupByCourse(purchase);
    const data = Object.entries(groupEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total,
    }));

    const totalRevenue = data.reduce((acc, { total }) => acc + total, 0);

    const totalSales = purchase.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS_ERROR]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
