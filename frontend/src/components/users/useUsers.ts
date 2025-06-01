import { useQuery } from "@tanstack/react-query";

export type User = {
	id: number;
	display_name: string;
};

async function fetchUsers(): Promise<User[]> {
	const res = await fetch("http://localhost:3000/api/v1/chefs");
	if (!res.ok) throw new Error("Failed to fetch users");
	return res.json();
}

export const useUsers = () =>
	useQuery<User[]>({
		queryKey: ["users"],
		queryFn: fetchUsers,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false
	});
