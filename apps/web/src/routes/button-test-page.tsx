import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@zim/ui";
import { ArrowRight, ArrowRightIcon, ArrowUpRight, InfoIcon, Trash, User, X } from "lucide-react";

const ButtonTestPage = () => {
  return (
    <div className="grid grid-cols-5 mx-auto gap-5 py-10 px-5 ">
      <Button size="default" variant="default">
        ZimZim <ArrowRight className="group-hover:translate-x-1.5 duration-300" />
      </Button>
      <Button size="default" variant="secondary">
        Button secondary
      </Button>
      <Button size="default" variant="destructive">
        Button
      </Button>
      <Button size="default" variant="link">
        Button link
      </Button>
      <Button size="default" variant="ghost">
        Button ghost
      </Button>

      <Button size="lg" variant="default">
        Button default
      </Button>
      <Button size="lg" variant="secondary">
        Button secondary
      </Button>
      <Button size="lg" variant="destructive">
        Button
      </Button>
      <Button size="lg" variant="link">
        Button link
      </Button>
      <Button size="lg" variant="ghost">
        Button ghost
      </Button>

      <Button size="sm" variant="default">
        Button default
      </Button>
      <Button size="sm" variant="secondary">
        Button secondary
      </Button>
      <Button size="sm" variant="destructive">
        Button
      </Button>
      <Button size="sm" variant="link">
        Button link
      </Button>
      <Button size="sm" variant="ghost">
        Button ghost
      </Button>

      <div className="flex gap-5 col-span-5">
        <Button size="icon" variant="default">
          <ArrowRightIcon />
        </Button>
        <Button size="icon" variant="secondary">
          <User />
        </Button>
        <Button size="icon" variant="destructive">
          <Trash />
        </Button>
        <Button size="icon" variant="link">
          <ArrowUpRight />
        </Button>
        <Button size="icon" variant="ghost">
          <X />
        </Button>
      </div>

      <Button loading={true} size="default" variant="default">
        ZimZim <ArrowRight className="group-hover:translate-x-1.5 duration-300" />
      </Button>
      <Button loading={true} size="default" variant="secondary">
        Button secondary
      </Button>
      <Button loading={true} size="default" variant="destructive">
        Button
      </Button>
      <Button loading={true} size="default" variant="link">
        Button link
      </Button>
      <Button loading={true} size="default" variant="ghost">
        Button ghost
      </Button>
    </div>
  );
};

export const Route = createFileRoute("/button-test-page")({
  component: ButtonTestPage,
});
