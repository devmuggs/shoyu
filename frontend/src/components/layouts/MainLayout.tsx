import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

interface MainLayoutProps {
	header?: ReactNode;
	sidebar?: ReactNode;
	children?: ReactNode | ReactNode[];
	className?: string;
}

export default function MainLayout({ header, sidebar, children, className }: MainLayoutProps) {
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col ">
			{/* Header */}
			{header && (
				<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="mx-auto max-w-7xl px-4 py-3">{header}</div>
				</header>
			)}

			{/* Main layout */}
			<div className="flex flex-1 mx-auto px-4 py-6 gap-6 w-screen h-screen overflow-y-auto overflow-x-hidden">
				{/* Sidebar */}
				{sidebar && <aside className="hidden md:block max-w-64">{sidebar}</aside>}

				{/* Main content */}
				<main
					className={cn("flex-1 grow items-center justify-center max-w-7xl", className)}
				>
					{children}
				</main>

				<Toaster />
			</div>
		</div>
	);
}
