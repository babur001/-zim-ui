import { createFileRoute } from "@tanstack/react-router";
import { Select } from "@zim/ui";
import { useState } from "react";

type ITechnologyList = { value: string; label: string; uuid?: string };

const getTechnologies = (searchText: string) => {
  console.log(searchText);

  return new Promise<ITechnologyList[]>((res, rej) =>
    setTimeout(() => {
      res(
        [
          {
            value: "next.js",
            label: "next.js",
            uuid: "121212121212",
          },
          {
            value: "sveltekit",
            label: "SvelteKit",
          },
          {
            value: "nuxt.js",
            label: "Nuxt.js",
          },
        ].filter((item) => (searchText ? item.label.toLocaleLowerCase().includes(searchText.toLowerCase()) : true))
      );
    }, 300)
  );
};

const HomeComponent = () => {
  const [value, setValue] = useState({
    value: "nuxt.js",
    title: "nuxt.js",
  });
  return (
    <div className="w-[300px] mx-auto h-full flex items-center justify-center">
      <Select
        searchMode="async"
        optionValue={(item) => item.value}
        optionTitle={(item) => item.label}
        fetcher={getTechnologies}
        value={value}
        onChange={(data) => {
          setValue(data);
        }}
      />
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
