import { createFileRoute } from "@tanstack/react-router";
import { DatePicker } from "@zim/ui";

const HomeComponent = () => {
  return (
    <div className="min-w-[200px] flex items-center mx-auto gap-10 justify-center h-full">
      <DatePicker />
      <DatePicker.RangePicker />
    </div>
  );
};

export const Route = createFileRoute("/date-test-page")({
  component: HomeComponent,
});
