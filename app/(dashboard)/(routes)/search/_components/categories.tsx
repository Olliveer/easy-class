"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";

import type { IconType } from "react-icons";
import CategoryItem from "./category-item";

type CategoriesProps = {
  items: Category[];
};

const IconMap: Record<Category["name"], IconType> = {
  Photography: FcOldTimeCamera,
  Accounting: FcSalesPerformance,
  Engineering: FcEngineering,
  Filming: FcFilmReel,
  Music: FcMusic,
  Fitness: FcSportsMode,
  "Computer Science": FcMultipleDevices,
};

function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={IconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
}

export default Categories;
