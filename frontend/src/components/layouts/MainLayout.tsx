import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import React from "react";

interface MainLayoutProps {
	header: ReactNode;
	sidebar: ReactNode;
	children: ReactNode | ReactNode[];
	className?: string;
}

export default React.memo(function MainLayout({
	header,
	sidebar,
	children,
	className
}: MainLayoutProps) {
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			{/* Header */}
			{header && (
				<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="mx-auto max-w-7xl px-4 py-3">{header}</div>
				</header>
			)}

			{/* Main layout */}
			<div className="flex flex-1 w-full max-w-7xl mx-auto px-4 py-6 gap-6">
				{/* Sidebar */}
				{sidebar && <aside className="hidden md:block w-64">{sidebar}</aside>}

				{/* Main content */}
				<main className={cn("flex-1", className)}>{children}</main>
			</div>
		</div>
	);
});
