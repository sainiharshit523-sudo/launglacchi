import { createFileRoute, notFound } from "@tanstack/react-router";

// Standard /admin route is permanently disabled for security.
// Any visitor attempting to access /admin will see the standard 404 Page Not Found.
export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    throw notFound();
  },
  component: () => null,
});
