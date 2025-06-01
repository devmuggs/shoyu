import { useState } from "react";
import type { User } from "./types";
import { UserCard } from "./user-card";

export interface UserCardSelectProps {
	users: User[];
}

export default function UserCardSelect({ users }: UserCardSelectProps) {
	const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

	return (
		<div
			className="flex gap-4 items-center justify-center h-full"
			onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
		>
			{users.map((user) => (
				<UserCard key={user.id} user={user} cursor={cursor} />
			))}

			<UserCard user={null} cursor={cursor} />
		</div>
	);
}
