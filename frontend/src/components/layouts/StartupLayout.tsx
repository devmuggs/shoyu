import Dashboard from "@/pages/Dashboard";
import ErrorPage from "@/pages/ErrorPage";
import SignUp from "@/pages/SignUp";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Loader } from "../ui/Loader";
import { useUserStore } from "../users";
import { useUsers } from "../users/useUsers";
import UserCardSelect from "../users/user-card-select";

export default function StartupLayout() {
	const user = useUserStore(({ user }) => user);

	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/dashboard");
		}
	}, [user, navigate]);

	// user from userStore
	const { data: users, isLoading, isError, error } = useUsers();
	if (isLoading) return <Loader />;
	if (isError) return <ErrorPage title={error.name} error={error.message} />;

	if (users?.length === 0) return <SignUp />;
	if (!user && users) return <UserCardSelect users={users} />;
	if (user) return <Dashboard />;

	return <Outlet />;
}
