import { GoBack, GoHome } from "@/components/go-back";

export default function NotFound() {
  return (
    <div className="m-[40vh_auto] flex flex-col w-fit gap-4">
      <GoBack />
      <GoHome />
    </div>
  );
}
