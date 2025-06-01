import StartupLayout from "@/components/layouts/StartupLayout";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
	{
		path: "/",
		element: <StartupLayout />,
		children: [
			{
				path: "dashboard",
				element: <Dashboard />
			}
		]
	},
	{
		path: "*",
		element: <NotFound />
	}
]);

export default router;
