import * as React from "react";
import { Button } from "#/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/popover";
import { cn } from "#/lib/utils";
import { Calendar, RangeCalendar } from "#/components/calendar";
import { CalendarIcon, CornerDownLeft, X } from "lucide-react";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { DateField, DateInput, DateSegment, Button as ButtonRac, Form, type DateValue } from "react-aria-components";

const formatter = new DateFormatter(navigator.language ?? "ru-RU", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

type TDateRangeValue = {
  from: DateValue | undefined;
  to: DateValue | undefined;
};

interface IButtonDatePickerTriggererSimple {
  type: "simple";
  date?: DateValue;
  placeholder?: React.ReactNode;
  onClear: () => unknown;
}

interface IButtonDatePickerTriggererRange {
  type: "range";
  date?: TDateRangeValue;
  placeholder?: React.ReactNode;
  onClear: () => unknown;
}

const ButtonDatePickerTriggerer = ({
  date,
  placeholder = "Select date",
  onClear,
  type,
  ...buttonProps
}: (IButtonDatePickerTriggererSimple | IButtonDatePickerTriggererRange) & React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      id="date"
      variant="secondary"
      className={cn("w-full min-w-48 hover:scale-100 justify-start text-left font-normal", {
        "text-accent": (type === "simple" && !date) || (type === "range" && !date?.from && !date?.to),
      })}
      {...buttonProps}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />

      <div className="flex items-center justify-center gap-3 flex-1 flex-grow">
        {(() => {
          if (type === "simple" && date) return <>{formatter.format(date.toDate(getLocalTimeZone()))}</>;
          if (type === "range" && date?.from && date?.to) {
            return <span>{formatter.formatRange(date.from.toDate(getLocalTimeZone()), date.to.toDate(getLocalTimeZone()))}</span>;
          }

          return <span>{placeholder}</span>;
        })()}
      </div>

      {(type === "simple" && date) || (type === "range" && date?.from && date.to) ? (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClear();
          }}
          size="icon"
          variant="ghost"
          className="rounded-full size-7"
        >
          <X />
        </Button>
      ) : null}
    </Button>
  );
};

const DatePickerForm = ({ date, onSubmit, locale }: { date?: TDateRangeValue; locale: TDateRangeLocale; onSubmit?: (params: TDateRangeValue) => unknown }) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const [inputDate, setInputDate] = React.useState<{ from: DateValue | undefined; to: DateValue | undefined }>(
    () =>
      date ?? {
        from: undefined,
        to: undefined,
      }
  );

  const validate = (range: typeof inputDate) => {
    const errObject: { start?: string; end?: string; general?: string } = {};

    if (!range.from) {
      errObject["start"] = locale.startDateRequred;
    }

    if (!range.to) {
      errObject["end"] = locale.endDateRequired;
    }

    const isStartBeforeEnd = range.from && range.to ? range.from.compare(range.to) <= 0 : false;

    if (!isStartBeforeEnd) {
      errObject["general"] = locale.endDateMustBeAfterStatDate;
    }

    return errObject;
  };

  const errors = isSubmitted ? validate(inputDate) : {};

  const submitByEnterCb = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Manually dispatch submit event
      const form = e.currentTarget.closest("form");
      if (form) form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  };

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const errors = validate(inputDate);

        // if errors is empty -> valdiation passes
        if (Object.keys(errors).length === 0) {
          onSubmit && onSubmit(inputDate);
        }
      }}
      className="flex flex-col justify-between flex-1 w-48"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="block text-sm text-accent font-light">{locale.from}</span>

          <DateField
            aria-label="start"
            value={inputDate.from}
            onChange={(e) => {
              setInputDate((prev) => ({
                ...prev,
                from: e ?? undefined,
              }));
            }}
            onKeyDown={submitByEnterCb}
          >
            <DateInput className="bg-white rounded-md border-[0.25px] border-accent/40 focus-within:ring-2 ring-ring duration-200 h-12 flex items-center px-2">
              {(segment) => <DateSegment className="data-[focused=true]:bg-gray-200 px-0.5 rounded-xs outline-0" segment={segment} />}
            </DateInput>
            {errors.start ? <span className="text-xs text-destructive">{errors.start}</span> : null}
          </DateField>
        </div>

        <div className="space-y-1">
          <span className="block text-sm text-accent font-light">{locale.to}</span>

          <DateField
            aria-label="end"
            value={inputDate.to}
            onChange={(e) => {
              setInputDate((prev) => ({
                ...prev,
                to: e ?? undefined,
              }));
            }}
            onKeyDown={submitByEnterCb}
          >
            <DateInput className="bg-white rounded-md border-[0.25px] border-accent/40 focus-within:ring-2 ring-ring duration-200 h-12 flex items-center px-2">
              {(segment) => <DateSegment className="data-[focused=true]:bg-gray-200 px-0.5 rounded-xs outline-0" segment={segment} />}
            </DateInput>
            {errors.end ? <span className="text-xs block text-destructive">{errors.end}</span> : null}
            {errors.general ? <span className="text-xs block text-destructive">{errors.general}</span> : null}
          </DateField>
        </div>
      </div>

      <Button asChild variant="secondary" size="sm" className="w-full" type="submit">
        <ButtonRac type="submit">
          {locale.btnSubmit} <CornerDownLeft className="size-4" />
        </ButtonRac>
      </Button>
    </Form>
  );
};

interface TDateRangeLocale {
  btnSubmit: string;
  from: string;
  to: string;
  startDateRequred: string;
  endDateRequired: string;
  endDateMustBeAfterStatDate: string;
}

const DateRangePicker = ({
  className,
  placeholder = "Select date",
  locale = {
    btnSubmit: "Apply",
    from: "From",
    to: "To",
    startDateRequred: "Start date is required",
    endDateRequired: "End date is required",
    endDateMustBeAfterStatDate: "End date must be after start date",
  },
}: {
  className?: string;
  placeholder?: string;
  locale?: TDateRangeLocale;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [date, setDate] = React.useState<{ from: DateValue | undefined; to: DateValue | undefined }>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={isOpen}
        onOpenChange={(e) => {
          if (!e) return setIsOpen(false);
        }}
      >
        <PopoverTrigger asChild onClick={() => setIsOpen((prev) => !prev)}>
          <ButtonDatePickerTriggerer placeholder={placeholder} type="range" date={date} onClear={() => setDate({ from: undefined, to: undefined })} />
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
                setDate(newDateRange);
              }}
            />

            <DatePickerForm
              date={date}
              locale={locale}
              onSubmit={(range) => {
                setDate(range);
                setIsOpen(false);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const DatePicker = ({ className, placeholder = "Select date" }: { className?: string; placeholder?: string }) => {
  const [date, setDate] = React.useState<DateValue | undefined>(undefined);

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={isOpen}
        onOpenChange={(e) => {
          if (!e) return setIsOpen(false);
        }}
      >
        <PopoverTrigger asChild onClick={() => setIsOpen((prev) => !prev)}>
          <ButtonDatePickerTriggerer placeholder={placeholder} type="simple" date={date} onClear={() => setDate(undefined)} />
        </PopoverTrigger>

        <PopoverContent className="w-full px-3 py-3 shadow-md" align="center">
          <div className="flex gap-7">
            <Calendar
              value={date}
              onChange={(e) => {
                setIsOpen(false);
                setDate(e);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

DatePicker.RangePicker = DateRangePicker;

export { DatePicker };
