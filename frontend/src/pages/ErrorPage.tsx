import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function ErrorPage({ title, error }: { title: string; error: string }) {
	return (
		<Alert variant="destructive">
			<AlertCircleIcon />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>
				<p>{error}</p>
			</AlertDescription>
		</Alert>
	);
}
