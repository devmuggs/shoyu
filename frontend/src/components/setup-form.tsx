import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useUserStore, type User } from "./users";

const locales = ["en-GB", "ja-JP"] as const;
export type locale = (typeof locales)[number];

const localeToLabel: Record<locale, string> = {
	"en-GB": "English (UK)",
	"ja-JP": "日本語"
} as const;

const FormSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(6),
		confirmPassword: z.string(),
		displayName: z.string().min(3),
		locale: z.enum(locales)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"] // attach error to confirmPassword field
	});

export function SetupForm() {
	const setUser = useUserStore((state) => state.setUser);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			locale: locales[0]
		}
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		toast("You submitted the following values", {
			description: (
				<pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			)
		});

		const res = await fetch("http://localhost:3000/api/v1/chefs", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				display_name: data.displayName,
				email: data.email,
				password: data.password,
				role_id: 1
			})
		});

		if (!res.ok) {
			throw new Error("Failed to submit");
		}

		return res.json() as Promise<User>;
	}

	function useSubmitSetup() {
		return useMutation({
			mutationFn: onSubmit,
			onSuccess: (data) => {
				toast.success("Saved successfully.");
				setUser({ display_name: data.display_name, id: data.id });
			},
			onError: (error) => toast.error(`Submission failed: ${error.message}`)
		});
	}

	const mutation = useSubmitSetup();
	const handleSubmit = (data: z.infer<typeof FormSchema>) => {
		mutation.mutate(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="...@gmail.com" {...field} />
							</FormControl>
							<FormDescription>
								This is your email, used to sign in and opt into notifications.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="displayName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Display Name</FormLabel>
							<FormControl>
								<Input placeholder="display name..." {...field} />
							</FormControl>
							<FormDescription>This is your public display name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="" {...field} />
							</FormControl>
							<FormDescription>
								Keep it secret, keep it safe. Minimum 6 characters.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password Confirmation</FormLabel>
							<FormControl>
								<Input type="password" placeholder="" {...field} />
							</FormControl>
							<FormDescription>
								Please re-enter your password to confirm.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="locale"
					defaultValue={locales[0]}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Locale</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a preferred locale" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{locales.map((l) => (
										<SelectItem key={l} value={l}>
											{localeToLabel[l]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								This will change the display language.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
