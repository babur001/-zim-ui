import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "#/lib/utils";
import { Button } from "#/components/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "#/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/popover";

const frameworksRef = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function Select() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [frameworks, setFrameworks] = React.useState<typeof frameworksRef>([]);

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);

      const { data } = await new Promise<{ data: typeof frameworksRef }>((res, rej) => {
        setTimeout(() => {
          res({ data: frameworksRef });
        }, 3000);
      });
      setIsLoading(false);

      setFrameworks(data);
    })();
  }, []);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[400px] justify-between">
          {value ? frameworks.find((framework) => framework.value === value)?.label : <span className="text-accent font-normal">Meet Your AI Engineer</span>}
          <div className="flex items-center gap-3">
            {value ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  setValue("");
                }}
                size="icon"
                variant="ghost"
                className="rounded-full size-7"
              >
                <X className="text-accent" />
              </Button>
            ) : null}

            <ChevronsUpDown className="text-accent" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" isLoading={isLoading} />
          <CommandList>
            <CommandEmpty className="!py-3 text-center text-accent font-normal text-sm">Ombor topilmadi</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <>{new Array(2).fill(<CommandItem className="bg-accent/20 !mb-1 animate-pulse" />)}</>
              ) : (
                <>
                  {frameworks.map((framework) => {
                    return (
                      <CommandItem
                        data-checked={value === framework.value}
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                        <Check className={cn("ml-auto", value === framework.value ? "opacity-100" : "opacity-0 !text-red-400")} />
                      </CommandItem>
                    );
                  })}
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// export const Test = () => {
//   const
//   return (
//     <Select
//       fetcher={() =>
//         Promise((res, rej) =>
//           setTimeout(() => {
//             res("success");
//           }, 1000)
//         )
//       }
//     />
//   );
// };
