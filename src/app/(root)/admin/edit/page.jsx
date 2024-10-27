import Edit from "@/app/components/Edit";
import { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense>
        <Edit />
      </Suspense>
    </>
  );
};

export default page;
