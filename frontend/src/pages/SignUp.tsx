import { SetupForm } from "@/components/setup-form";
import { Card, CardContent } from "@/components/ui/card";

export default function SignUp() {
	return (
		<div className="h-full flex flex-col items-center justify-center gap-4">
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Sign Up</h1>
				<div className="grow max-w-md">
					<Card>
						<CardContent>
							<SetupForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
