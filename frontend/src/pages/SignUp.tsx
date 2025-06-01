import { SetupForm } from "@/components/setup-form";
import { Card, CardContent } from "@/components/ui/card";

export default function SignUp() {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
				Initial Setup
			</h1>
			<div className="grow max-w-md">
				<Card>
					<CardContent>
						<SetupForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
