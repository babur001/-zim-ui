import { createFileRoute } from "@tanstack/react-router";
import { DatePicker } from "@zim/ui";

const HomeComponent = () => {
  return (
    <div className="min-w-[200px] flex items-center mx-auto gap-10 justify-center h-full">
      <DatePicker placeholder="Sanani tanlang" />
      <DatePicker.RangePicker
        placeholder="Sanani tanlang"
        locale={{
          btnSubmit: "Saqlash",
          from: "Boshlanish sanasi",
          to: "Yakunlash sanasi",
          startDateRequred: "Boshlash sanasi majburiy",
          endDateRequired: "Yakunlash sanasi majburiy",
          endDateMustBeAfterStatDate: "Yakunlash sanasi boshlashdan oldin bo'lishi kerak",
        }}
      />
    </div>
  );
};

export const Route = createFileRoute("/date-test-page")({
  component: HomeComponent,
});
