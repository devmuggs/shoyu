import { Button } from "@/components/ui/button";
import { useUserStore } from "@/components/users";

export function LogoutButton() {
	const { clearUser, user } = useUserStore((state) => state);
	return !user ? (
		<></>
	) : (
		<Button
			variant="destructive"
			onClick={() => {
				clearUser();
				location.pathname = "/";
			}}
		>
			Log out
		</Button>
	);
}
