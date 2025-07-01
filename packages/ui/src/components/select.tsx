import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "#/lib/utils";
import { Button } from "#/components/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "#/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/popover";

type TOption = {
  title: string;
  value: string;
};

type TOptionWithData<T> = TOption & { data: T };

interface BaseSelectProps<T> {
  searchMode?: "async" | "sync";
  filterFn?: (param: T, debouncedSearchText: string) => T[];
  placeholder?: React.ReactNode;
  emptyState?: React.ReactNode;
  onChange?: (params: TOptionWithData<T>) => unknown;
  value?: TOption & Record<string, any>;
  initialValue?: TOption;
  optionValue?: (item: T) => string;
  optionTitle?: (item: T) => string;
}

interface SyncSelectProps<T> extends BaseSelectProps<T> {
  options: T[];
}

interface AsyncSelectProps<T> extends BaseSelectProps<T> {
  fetcher: (searchText: string) => Promise<T[]>;
}

type SelectProps<T> = SyncSelectProps<T> | AsyncSelectProps<T>;

export function Select<T extends object>({
  optionTitle,
  optionValue,
  filterFn,
  initialValue,
  onChange,
  value: valueProp,
  emptyState = "Not found",
  placeholder = "Placeholder..",
  searchMode = "sync",
  ...props
}: SelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [value, setValue] = React.useState<TOption | undefined>(valueProp || initialValue);
  const [isLoading, setIsLoading] = React.useState(false);
  const [frameworks, setFrameworks] = React.useState<TOptionWithData<T>[]>([]);

  const debouncedSearchText = useDebounce(searchText, 300);

  const refMounted = React.useRef(false);
  React.useEffect(() => {
    refMounted.current = true;
  }, []);

  const loadOptions = async (searchProp: string = "") => {
    if ("fetcher" in props) {
      try {
        setIsLoading(true);

        const options = await props.fetcher(searchProp);

        const filteredOptions = options.map((option) => ({
          data: option,
          title: optionTitle
            ? optionTitle(option)
            : "title" in option
            ? (option.title as string)
            : (() => {
                throw new Error("Title is not present in 'fetcher' response");
              })(),
          value: optionValue
            ? optionValue(option)
            : "value" in option
            ? (option.value as string)
            : (() => {
                throw new Error("Value is not present in 'fetcher' response");
              })(),
        }));

        setFrameworks(filteredOptions);
      } finally {
        setIsLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if ("fetcher" in props) {
      loadOptions();
    }
  }, []);

  React.useEffect(() => {
    if (searchMode === "async") {
      loadOptions(searchText);
    } else if (searchMode === "sync") {
      setFrameworks(frameworks.filter((framework) => (filterFn ? filterFn(framework.data, searchText) : true)));
    }
  }, [debouncedSearchText]);

  const onSelect = (framework: TOptionWithData<T>) => {
    const selectedValue = { title: framework.title, value: framework.value };

    setValue(selectedValue);
    if (onChange) onChange({ ...selectedValue, data: framework.data });
    setOpen(false);
  };

  const renderFrameworks = () => {
    if (isLoading) {
      return new Array(2).fill(<CommandItem className="bg-accent/20 !mb-1 animate-pulse" />);
    }

    return frameworks.map((framework) => (
      <CommandItem data-checked={value?.value === framework.value} key={framework.value} value={framework.value} onSelect={() => onSelect(framework)}>
        {framework.title}
        <Check className={cn("ml-auto", value?.value === framework.value ? "opacity-100" : "opacity-0 !text-red-400")} />
      </CommandItem>
    ));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[400px] justify-between">
          {value ? value.title : <span className="text-accent font-normal">{placeholder}</span>}
          <div className="flex items-center gap-3">
            {value && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setValue(undefined);
                }}
                size="icon"
                variant="ghost"
                className="rounded-full size-7"
              >
                <X className="text-accent" />
              </Button>
            )}
            <ChevronsUpDown className="text-accent" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search framework..." className="h-9" isLoading={isLoading} value={searchText} onValueChange={setSearchText} />
          <CommandList>
            {!isLoading ? <CommandEmpty className="!py-3 text-center text-accent font-normal text-sm">{emptyState}</CommandEmpty> : null}

            <CommandGroup>{renderFrameworks()}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
