import { createFileRoute } from "@tanstack/react-router";
import { Select } from "@zim/ui";
import { useState } from "react";

type ITechnologyList = { value: string; label: string; uuid?: string };

const getTechnologies = (searchText: string) => {
  return new Promise<ITechnologyList[]>((res, rej) =>
    setTimeout(() => {
      res(
        new Array(30)
          .fill("")
          .map((_, index) => {
            return {
              value: `next.js-${index}`,
              label: `next.js-${index}`,
              uuid: "121212121212",
            };
          })
          .filter((item) => (searchText ? item.label.toLocaleLowerCase().includes(searchText.toLowerCase()) : true))
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
    <div className="w-[300px] mx-auto h-full pt-10">
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

export const Route = createFileRoute("/select-test-page")({
  component: HomeComponent,
});
