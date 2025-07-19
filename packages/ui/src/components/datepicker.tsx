import * as React from "react";
import { Button } from "#/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/popover";
import { cn } from "#/lib/utils";
import { Calendar, RangeCalendar } from "#/components/calendar";
import { CalendarIcon, CornerDownLeft, X } from "lucide-react";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { DateField, DateInput, DateSegment, Button as ButtonRac, Form, type DateValue, type DateFieldProps, type DateInputProps } from "react-aria-components";

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

const DateInputField = ({
  label,
  value,
  onChange,
  error,
  onKeyDown,
}: {
  label: string;
  value: DateValue | undefined;
  error?: string;
  onChange: (value: DateValue | null) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) => (
  <div className="space-y-1">
    <span className="block text-sm text-gray-500 font-light">{label}</span>
    <DateField aria-label={label.toLowerCase()} value={value} onChange={onChange} onKeyDown={onKeyDown}>
      <DateInput className="bg-white rounded-md border border-gray-300 focus-within:ring-2 ring-blue-500 duration-200 h-12 flex items-center px-2">
        {(segment) => <DateSegment className="data-[focused=true]:bg-gray-200 px-0.5 rounded-sm outline-0" segment={segment} />}
      </DateInput>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </DateField>
  </div>
);

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
    const errors: { start?: string; end?: string; general?: string } = {};

    if (!range.from) errors.start = locale.startDateRequired;
    if (!range.to) errors.end = locale.endDateRequired;
    if (range.from && range.to && range.from.compare(range.to) > 0) {
      errors.general = locale.endDateMustBeAfterStartDate;
    }
    return errors;
  };

  const errors = isSubmitted ? validate(inputDate) : {};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Manually dispatch submit event
      const form = e.currentTarget.closest("form");
      if (form) form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    const errors = validate(inputDate);

    // if errors is empty -> valdiation passes
    if (Object.keys(errors).length === 0) {
      onSubmit && onSubmit(inputDate);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 w-48">
      <div className="space-y-3">
        <DateInputField
          label={locale.from}
          value={inputDate.from}
          error={errors.start}
          onChange={(e) => {
            setInputDate((prev) => ({
              ...prev,
              from: e ?? undefined,
            }));
          }}
          onKeyDown={handleKeyDown}
        />

        <DateInputField
          label={locale.to}
          value={inputDate.to}
          error={errors.start}
          onChange={(e) => {
            setInputDate((prev) => ({
              ...prev,
              to: e ?? undefined,
            }));
          }}
          onKeyDown={handleKeyDown}
        />
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
  startDateRequired: string;
  endDateRequired: string;
  endDateMustBeAfterStartDate: string;
}

const DateRangePicker = ({
  className,
  placeholder = "Select date",
  locale = {
    btnSubmit: "Apply",
    from: "From",
    to: "To",
    startDateRequired: "Start date is required",
    endDateRequired: "End date is required",
    endDateMustBeAfterStartDate: "End date must be after start date",
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
