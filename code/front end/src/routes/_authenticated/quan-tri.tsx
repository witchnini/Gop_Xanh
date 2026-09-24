import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/quan-tri")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
