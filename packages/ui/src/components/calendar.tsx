"use client";

import type { ComponentProps } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Button as ButtonRac,
  CalendarCell as CalendarCellRac,
  CalendarGridBody as CalendarGridBodyRac,
  CalendarGridHeader as CalendarGridHeaderRac,
  CalendarGrid as CalendarGridRac,
  CalendarHeaderCell as CalendarHeaderCellRac,
  Calendar as CalendarRac,
  composeRenderProps,
  Heading as HeadingRac,
  RangeCalendar as RangeCalendarRac,
} from "react-aria-components";

import { cn } from "#/lib/utils";
import "dayjs/plugin/calendar";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "./button";

interface BaseCalendarProps {
  className?: string;
}

type CalendarProps = ComponentProps<typeof CalendarRac> & BaseCalendarProps;
type RangeCalendarProps = ComponentProps<typeof RangeCalendarRac> & BaseCalendarProps;

function CalendarHeader() {
  return (
    <header className="flex w-full items-center gap-1 pb-1">
      <ButtonRac slot="previous">
        <Button variant="secondary" size="icon">
          <ChevronLeftIcon />
        </Button>
      </ButtonRac>
      <HeadingRac className="grow text-center text-sm font-medium" />
      <ButtonRac slot="next">
        <Button slot="next" variant="secondary" size="icon">
          <ChevronRightIcon />
        </Button>
      </ButtonRac>
    </header>
  );
}

function CalendarGridComponent({ isRange = false }: { isRange?: boolean }) {
  const now = today(getLocalTimeZone());

  return (
    <CalendarGridRac>
      <CalendarGridHeaderRac>
        {(day) => <CalendarHeaderCellRac className="text-muted-foreground/80 size-9 rounded-md p-0 text-xs font-medium">{day}</CalendarHeaderCellRac>}
      </CalendarGridHeaderRac>
      <CalendarGridBodyRac className="[&_td]:px-0 [&_td]:py-px">
        {(date) => (
          <CalendarCellRac
            date={date}
            className={cn(
              "text-foreground data-hovered:!bg-primary cursor-pointer data-hovered:!text-white data-selected:bg-primary data-selected:text-primary-foreground data-focus-visible:ring-ring/50 relative flex size-9 items-center justify-center rounded-md p-0 text-sm font-normal whitespace-nowrap [transition-property:color,background-color,border-radius,box-shadow] duration-150 outline-none data-disabled:pointer-events-none data-disabled:opacity-30 data-focus-visible:z-10 data-focus-visible:ring-[3px] data-unavailable:pointer-events-none data-unavailable:line-through data-unavailable:opacity-30",
              // Range-specific styles
              isRange &&
                "data-selected:bg-background data-selected:text-foreground data-invalid:data-selection-end:bg-destructive data-invalid:data-selection-start:bg-destructive data-selection-end:bg-primary data-selection-start:bg-primary data-selection-end:text-primary-foreground data-selection-start:text-primary-foreground data-invalid:bg-red-100 data-selected:rounded-none data-selection-end:rounded-e-md data-invalid:data-selection-end:text-white data-selection-start:rounded-s-md data-invalid:data-selection-start:text-white",
              // Today indicator styles
              date.compare(now) === 0 &&
                cn(
                  "after:bg-primary after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full",
                  isRange ? "data-selection-end:after:bg-background data-selection-start:after:bg-background" : "data-selected:after:bg-background"
                )
            )}
          />
        )}
      </CalendarGridBodyRac>
    </CalendarGridRac>
  );
}

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <CalendarRac {...props} className={composeRenderProps(className, (className) => cn("w-fit", className))}>
      <CalendarHeader />
      <CalendarGridComponent />
    </CalendarRac>
  );
}

function RangeCalendar({ className, ...props }: RangeCalendarProps) {
  return (
    <RangeCalendarRac {...props} className={composeRenderProps(className, (className) => cn("w-fit", className))}>
      <CalendarHeader />
      <CalendarGridComponent isRange />
    </RangeCalendarRac>
  );
}

export { Calendar, RangeCalendar };
