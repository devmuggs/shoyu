import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import type { User } from "./types";

export interface UserCardProps {
	user: User | null;
	cursor: { x: number; y: number } | null;
}

const MAX_DISTANCE = 100;
const STRENGTH = 20;
const TILT = 10;
const SPRING_CONFIG = {
	stiffness: 400,
	damping: 20
};

// const colors = ["bg-yellow-800", "bg-amber-700", "bg-orange-700", "bg-orange-800"];
const colors = [
	"bg-gradient-to-t from-amber-700 to-amber-900",
	"bg-gradient-to-tr from-amber-700 to-amber-900",
	"bg-gradient-to-r from-amber-700 to-amber-900",
	"bg-gradient-to-br from-amber-700 to-amber-900",
	"bg-gradient-to-b from-amber-700 to-amber-900",
	"bg-gradient-to-bl from-amber-700 to-amber-900",
	"bg-gradient-to-l from-amber-700 to-amber-900",
	"bg-gradient-to-tl from-amber-700 to-amber-900"
];

function hashString(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // unsigned int
	}
	return hash;
}

export function UserCard({ user, cursor }: UserCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const rawX = useMotionValue(0);
	const rawY = useMotionValue(0);

	const x = useSpring(rawX, SPRING_CONFIG);
	const y = useSpring(rawY, SPRING_CONFIG);
	const rotateX = useSpring(useMotionValue(0), SPRING_CONFIG);
	const rotateY = useSpring(useMotionValue(0), SPRING_CONFIG);

	const acronym = useMemo(
		() =>
			!user
				? ""
				: user.display_name
						.split(" ")
						.slice(0, 3)
						.map((c) => c.at(0)?.toLocaleUpperCase())
						.join(""),
		[user]
	);

	const colorClass = useMemo(() => {
		if (!user?.id) return "bg-gradient-to-tl from-neutral-700 to-neutral-900";
		if (user.display_name === "セクシーセクシー")
			return "bg-gradient-to-tl from-pink-700 to-pink-900";
		const hash = hashString(`${user.id}`);
		const index = hash % colors.length;
		return colors[index];
	}, [user?.id]);

	useEffect(() => {
		if (!ref.current || !cursor) return;

		const rect = ref.current.getBoundingClientRect();

		const dx = cursor.x - (rect.left + rect.width / 2);
		const dy = cursor.y - (rect.top + rect.height / 2);

		const distance = Math.sqrt(dx ** 2 + dy ** 2);

		if (distance > MAX_DISTANCE) {
			rawX.set(0);
			rawY.set(0);
		} else {
			rawX.set((dx / distance) * STRENGTH);
			rawY.set((dy / distance) * STRENGTH);

			rotateX.set(-(dy / distance) * TILT);
			rotateY.set((dx / distance) * TILT);
		}
	}, [cursor]);

	return (
		<div className="relative group">
			<Card className={cn("absolute inset-1 opacity-50 blur-lg", colorClass)}></Card>
			<motion.div
				ref={ref}
				style={{ x, y, rotateX, rotateY }}
				whileHover={{ scale: 1.03 }}
				className="will-change-transform"
			>
				<button className="cursor-pointer" onClick={() => !user && navigate("/sign-up")}>
					<Card className={cn("w-fit bg-opacity-80 backdrop-blur-lg")}>
						<CardContent className="px-12">
							<div
								className={cn(
									"rounded-full w-24 h-24 flex items-center justify-center text-5xl",
									colorClass
								)}
							>
								{acronym ? acronym : <UserPlus />}
							</div>
						</CardContent>
						<CardFooter className={cn("flex-col gap-2")}>
							<p>{user ? user.display_name : "create new account"}</p>
						</CardFooter>
					</Card>
				</button>
			</motion.div>
		</div>
	);
}
