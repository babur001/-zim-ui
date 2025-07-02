import { Button } from "#/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/popover";
import { cn } from "#/lib/utils";
import { Calendar, RangeCalendar } from "#/components/calendar";
import dayjs from "dayjs";
import { CalendarIcon, CornerDownLeft, Regex } from "lucide-react";
import * as React from "react";
import { Input } from "./input";
import { withMask } from "use-mask-input";
import "dayjs/locale/ru";
import { fromDate, getLocalTimeZone, parseDate, toCalendarDate, toCalendarDateTime, toLocalTimeZone } from "@internationalized/date";

dayjs.locale("ru");

const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export function isValidDate(dateStr: string): boolean {
  // Match pattern dd/mm/yyyy using RegExp
  const match = dateStr.match(datePattern);

  if (!match) return false;

  const [_, dd, mm, yyyy] = match;

  // Convert parts to numbers
  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  const year = parseInt(yyyy, 10);

  if (year < 2000) return false;
  if (year > 2100) return false;
  if (month < 1 || month > 12) return false;

  // Use dayjs to construct the date
  const parsed = dayjs(`${yyyy}-${mm}-${dd}`, "YYYY-MM-DD", true);

  // Check if dayjs accepts the date and the input components match
  return parsed.isValid() && parsed.date() === day;
}

export function DateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [inputDate, setInputDate] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const ref_dateFrom = React.useRef("");
  const ref_dateTo = React.useRef("");

  const stringToDate = (dateStr: string) => {
    const match = dateStr.match(datePattern);

    const [_, dd, mm, yyyy] = match!;

    return dayjs(`${yyyy}-${mm}-${dd}`, "YYYY-MM-DD", true).toDate();
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={isOpen}
        onOpenChange={(e) => {
          if (!e) return setIsOpen(false);
        }}
      >
        <PopoverTrigger asChild onClick={() => setIsOpen((prev) => !prev)}>
          <Button id="date" variant="secondary" className={cn("w-full hover:scale-100 justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />

            <div className="flex items-center justify-center gap-3 flex-1 flex-grow">
              {date?.from ? (
                date.to ? (
                  <>
                    <span>{dayjs(date.from).format("DD MMMM YYYY")}</span>
                    <span>-</span>
                    <span>{dayjs(date.to).format("DD MMMM YYYY")}</span>
                  </>
                ) : (
                  <span>{dayjs(date.from).format("DD-MM-YYYY")}</span>
                )
              ) : (
                <span>Sanani tanlang</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full px-3 py-3 shadow-md" align="center">
          <div className="flex gap-7">
            <RangeCalendar
              value={
                date.from && date.to
                  ? {
                      start: fromDate(date.from, getLocalTimeZone()),
                      end: fromDate(date.to, getLocalTimeZone()),
                    }
                  : undefined
              }
              onChange={(e) => {
                const newDateRange = {
                  from: e.start.toDate(getLocalTimeZone()),
                  to: e.end.toDate(getLocalTimeZone()),
                };

                setIsOpen(false);
                setInputDate(newDateRange);
                setDate(newDateRange);
              }}
            />

            <div className="flex flex-col justify-between flex-1">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="block text-sm text-accent font-light">Start</span>
                  <Input
                    onChange={(e) => {
                      ref_dateFrom.current = e.currentTarget.value;
                    }}
                    defaultValue={inputDate.from ? dayjs(inputDate.from).format("DD/MM/YYYY") : undefined}
                    placeholder="01/01/2025"
                    ref={withMask("99/99/9999", {
                      greedy: false,
                      placeholder: "",
                      showMaskOnFocus: false,
                      showMaskOnHover: false,
                    })}
                  />
                </div>

                <div className="space-y-1">
                  <span className="block text-sm text-accent font-light">End</span>
                  <Input
                    onChange={(e) => {
                      ref_dateTo.current = e.currentTarget.value;
                    }}
                    defaultValue={inputDate.to ? dayjs(inputDate.to).format("DD/MM/YYYY") : undefined}
                    placeholder="01/01/2025"
                    ref={withMask("99/99/9999", {
                      placeholder: "",
                      showMaskOnFocus: false,
                      showMaskOnHover: false,
                    })}
                  />
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => {
                  const newInputtedDate = {
                    ...inputDate,
                    ...(ref_dateFrom.current ? { from: stringToDate(ref_dateFrom.current) } : {}),
                    ...(ref_dateTo.current ? { to: stringToDate(ref_dateTo.current) } : {}),
                  };

                  setDate(newInputtedDate);
                  setInputDate(newInputtedDate);
                }}
              >
                Apply <CornerDownLeft className="size-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
