import { Button } from "@/components/ui/button";
import Link from "next/link";

function Courses() {
  return (
    <div>
      <Link href="/teacher/create">
        <Button>New course</Button>
      </Link>
    </div>
  );
}

export default Courses;
