import { useQuery } from "@tanstack/react-query";
import type { User } from "./types";

async function fetchUsers(): Promise<User[]> {
	const res = await fetch("http://localhost:3000/api/v1/chefs");
	if (!res.ok) throw new Error("Failed to fetch users");
	return (await res.json()).chefs;
}

export const useUsers = () =>
	useQuery<User[]>({
		queryKey: ["users"],
		queryFn: fetchUsers,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false
	});
