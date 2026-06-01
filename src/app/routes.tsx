import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Planner } from "./pages/Planner";
import { Itinerary } from "./pages/Itinerary";
import { Calendar } from "./pages/Calendar";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Planner },
      { path: "itinerary", Component: Itinerary },
      { path: "calendar", Component: Calendar },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
