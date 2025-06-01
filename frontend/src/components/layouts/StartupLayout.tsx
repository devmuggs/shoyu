import { Outlet } from "react-router";
import { useUsers } from "../users/useUsers";

export default function StartupLayout() {
	const signedInUser = undefined;

	// user from userStore
	const { data: users, isLoading, isError } = useUsers();
	if (isLoading) return <>loading-spinner</>;
	if (isError) return <>error-page</>;

	if (users?.length === 0) return <>sign up admin</>;
	if (!signedInUser) return <>sign in</>;

	return <Outlet />;
}
