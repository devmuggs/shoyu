// withMagnetic.tsx
import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

interface MagneticOptions {
	maxDistance?: number;
	strength?: number;
}

export function withMagnetic<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	options: MagneticOptions = {}
) {
	const { maxDistance = 100, strength = 20 } = options;

	return (props: P & { cursor: { x: number; y: number } | null }) => {
		const { cursor, ...rest } = props;
		const ref = useRef<HTMLDivElement>(null);
		const x = useMotionValue(0);
		const y = useMotionValue(0);

		useEffect(() => {
			if (!ref.current || !cursor) return;

			const rect = ref.current.getBoundingClientRect();
			const dx = cursor.x - (rect.left + rect.width / 2);
			const dy = cursor.y - (rect.top + rect.height / 2);
			const distance = Math.sqrt(dx ** 2 + dy ** 2);

			if (distance > maxDistance) {
				x.set(0);
				y.set(0);
				return;
			}

			x.set((dx / distance) * strength);
			y.set((dy / distance) * strength);
		}, [cursor]);

		return (
			<motion.div
				ref={ref}
				style={{ x, y }}
				className="transition-transform will-change-transform"
			>
				<WrappedComponent {...(rest as P)} />
			</motion.div>
		);
	};
}
