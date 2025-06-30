import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/blog")({
  component: Blog,
});

function Blog() {
  return <div>Blog</div>;
}
