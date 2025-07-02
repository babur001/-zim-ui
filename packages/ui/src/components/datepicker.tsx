import { Button } from "#/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/popover";
import { cn } from "#/lib/utils";
import { RangeCalendar } from "#/components/calendar";
import dayjs from "dayjs";
import { CalendarIcon, CornerDownLeft } from "lucide-react";
import * as React from "react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { DateField, DateInput, DateSegment, FieldError, type DateValue } from "react-aria-components";

const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function isValidDate(dateStr: string): boolean {
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
  const [date, setDate] = React.useState<{ from: DateValue | undefined; to: DateValue | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [inputDate, setInputDate] = React.useState<{ from: DateValue | undefined; to: DateValue | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const isInputtedDateRangeValid = dayjs(inputDate.from?.toString()).isBefore(inputDate.to?.toString());

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
                    <span>{dayjs(date.from.toDate(getLocalTimeZone())).format("DD MMMM YYYY")}</span>
                    <span>-</span>
                    <span>{dayjs(date.to.toDate(getLocalTimeZone())).format("DD MMMM YYYY")}</span>
                  </>
                ) : (
                  <span>{dayjs(date.from.toDate(getLocalTimeZone())).format("DD-MM-YYYY")}</span>
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
                      start: date.from,
                      end: date.to,
                    }
                  : undefined
              }
              onChange={(e) => {
                const newDateRange = {
                  from: e.start,
                  to: e.end,
                };

                setIsOpen(false);
                setInputDate(newDateRange);
                setDate(newDateRange);
              }}
            />

            <div className="flex flex-col justify-between flex-1 w-48">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="block text-sm text-accent font-light">Start</span>

                  <DateField
                    minValue={new CalendarDate(2000, 1, 1)}
                    maxValue={today(getLocalTimeZone())}
                    value={inputDate.from}
                    onChange={(e) => {
                      setInputDate((prev) => ({
                        ...prev,
                        from: e ?? undefined,
                      }));
                    }}
                  >
                    <DateInput className="bg-white rounded-md border-[0.25px] border-accent/40 focus-within:ring-2 ring-ring duration-200 h-12 flex items-center px-2">
                      {(segment) => <DateSegment className="data-[focused=true]:ring-2 outline-0 rounded-xs !ring-primary/90" segment={segment} />}
                    </DateInput>
                    <FieldError className="text-xs text-destructive" />
                  </DateField>
                </div>

                <div className="space-y-1">
                  <span className="block text-sm text-accent font-light">End</span>

                  <DateField
                    minValue={inputDate.from}
                    maxValue={today(getLocalTimeZone())}
                    value={inputDate.to}
                    onChange={(e) => {
                      setInputDate((prev) => ({
                        ...prev,
                        to: e ?? undefined,
                      }));
                    }}
                  >
                    <DateInput className="bg-white rounded-md border-[0.25px] border-accent/40 focus-within:ring-2 ring-ring duration-200 h-12 flex items-center px-2">
                      {(segment) => <DateSegment className="data-[focused=true]:ring-2 outline-0 rounded-xs !ring-primary/90" segment={segment} />}
                    </DateInput>
                    <FieldError className="text-xs text-destructive" />
                  </DateField>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                disabled={!isInputtedDateRangeValid}
                onClick={() => {
                  setDate({
                    from: inputDate.from,
                    to: inputDate.to,
                  });
                  setIsOpen(false);
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
