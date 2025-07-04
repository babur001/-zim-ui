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

const ButtonDatePickerTriggerer = ({
  date,
  placeholder = "Select date",
  onClear,
  ...buttonProps
}: React.HTMLAttributes<HTMLButtonElement> & {
  date: TDateRangeValue;
  placeholder?: React.ReactNode;
  onClear: () => unknown;
}) => {
  return (
    <Button
      id="date"
      variant="secondary"
      className={cn("w-full min-w-48 hover:scale-100 justify-start text-left font-normal", !date.from && "text-accent")}
      {...buttonProps}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />

      <div className="flex items-center justify-center gap-3 flex-1 flex-grow">
        {date.from && date.to ? (
          <span>{formatter.formatRange(date.from.toDate(getLocalTimeZone()), date.to.toDate(getLocalTimeZone()))}</span>
        ) : (
          <span>{placeholder}</span>
        )}
      </div>

      {date.from || date.to ? (
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

const DatePickerForm = ({
  date,
  submitBtnTitle,
  onSubmit,
}: {
  date?: TDateRangeValue;
  submitBtnTitle?: React.ReactNode;
  onSubmit?: (params: TDateRangeValue) => unknown;
}) => {
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
      errObject["start"] = "Start date is required";
    }

    if (!range.to) {
      errObject["end"] = "End date is required";
    }

    const isStartBeforeEnd = range.from && range.to ? range.from.compare(range.to) <= 0 : false;

    if (!isStartBeforeEnd) {
      errObject["general"] = "End date must be after start date";
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
          <span className="block text-sm text-accent font-light">Start</span>

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
          <span className="block text-sm text-accent font-light">End</span>

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
          {submitBtnTitle} <CornerDownLeft className="size-4" />
        </ButtonRac>
      </Button>
    </Form>
  );
};

const DateRangePicker = ({
  className,
  placeholder = "Select date",
  enterButtonTitle = "Apply",
}: {
  className?: string;
  placeholder?: string;
  enterButtonTitle?: React.ReactNode;
}) => {
  const [date, setDate] = React.useState<{ from: DateValue | undefined; to: DateValue | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="grid grid-cols-5 gap-10 p-5">
      <Calendar />

      <RangeCalendar />

      <ButtonDatePickerTriggerer placeholder={placeholder} date={date} onClear={() => {}} />

      <DatePickerForm
        date={date}
        onSubmit={(range) => {
          console.log(range);
        }}
        submitBtnTitle={enterButtonTitle}
      />

      <div className={cn("grid gap-2", className)}>
        <Popover
          open={isOpen}
          onOpenChange={(e) => {
            if (!e) return setIsOpen(false);
          }}
        >
          <PopoverTrigger asChild onClick={() => setIsOpen((prev) => !prev)}>
            <ButtonDatePickerTriggerer date={date} onClear={() => setDate({ from: undefined, to: undefined })} />
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
                submitBtnTitle={enterButtonTitle}
                onSubmit={(range) => {
                  console.log(range);
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const DatePicker = ({
  className,
  placeholder = "Select date",
  enterButtonTitle = "Apply",
}: {
  className?: string;
  placeholder?: string;
  enterButtonTitle?: React.ReactNode;
}) => {
  const [date, setDate] = React.useState<{ from: DateValue | undefined; to: DateValue | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="grid grid-cols-5 gap-10 p-5">
      <Calendar />

      <RangeCalendar />

      <ButtonDatePickerTriggerer placeholder={placeholder} date={date} onClear={() => {}} />

      <DatePickerForm
        date={date}
        onSubmit={(range) => {
          console.log(range);
        }}
        submitBtnTitle={enterButtonTitle}
      />

      <div className={cn("grid gap-2", className)}>
        <Popover
          open={isOpen}
          onOpenChange={(e) => {
            if (!e) return setIsOpen(false);
          }}
        >
          <PopoverTrigger asChild onClick={() => setIsOpen((prev) => !prev)}>
            <ButtonDatePickerTriggerer date={date} onClear={() => setDate({ from: undefined, to: undefined })} />
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
                submitBtnTitle={enterButtonTitle}
                onSubmit={(range) => {
                  console.log(range);
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

DatePicker.RangePicker = DateRangePicker;

export { DatePicker };
