import { createFileRoute } from "@tanstack/react-router";
import { Select } from "@zim/ui";

const HomeComponent = () => {
  return (
    <div className="w-[300px] mx-auto h-full flex items-center justify-center">
      <Select />
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
