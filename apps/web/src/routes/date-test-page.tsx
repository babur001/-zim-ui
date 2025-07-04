import { createFileRoute } from "@tanstack/react-router";
import { DateRangePicker } from "@zim/ui";

const HomeComponent = () => {
  return <DateRangePicker />;
};

export const Route = createFileRoute("/date-test-page")({
  component: HomeComponent,
});
