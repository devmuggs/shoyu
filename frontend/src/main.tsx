import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import router from "./routes";

import { QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layouts/MainLayout";
import { ThemeProvider, ThemeToggle } from "./components/theme-provider";
import { LogoutButton } from "./components/users";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MainLayout
				header={
					<ul className="flex gap-2">
						<li>
							<ThemeToggle />
						</li>
						<li>
							<LogoutButton />
						</li>
					</ul>
				}
			>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<RouterProvider router={router} />
				</ThemeProvider>
			</MainLayout>
		</QueryClientProvider>
	</StrictMode>
);
