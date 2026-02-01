import app_logo from "@/assets/img/app_logo.png";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth_store";
import {
	Link,
	createFileRoute,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import React, { useState } from "react";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
	beforeLoad: () => {
		const { user } = useAuthStore.getState();
		if (user) {
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	const { login, isLoading } = useAuthStore();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		try {
			await login(email, password);
			navigate({ to: "/" });
		} catch (error) {
			console.error("Login failed", error);
			setError(
				"Invalid credentials. Please contact your system administrator.",
			);
		}
	};

	return (
		<div className="flex min-h-screen w-full font-sans bg-background text-foreground">
			{/* --- LEFT COLUMN: Brand & Testimonial --- */}
			<div className="hidden lg:flex w-1/2 relative bg-slate-900 text-white flex-col justify-between p-16 overflow-hidden">
				{/* Abstract Background Decoration */}
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] opacity-10 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

				{/* Logo Area */}
				<div className="relative z-10 flex items-center gap-3">
					<img src={app_logo} className="size-10" />

					<span className="font-heading font-bold text-xl tracking-tight">
						Cer
						<span className="text-[var(--button-primary)]">
							tus
						</span>
					</span>
				</div>

				{/* Testimonial Content */}
				<div className="relative z-10 max-w-xl">
					<h2 className="font-heading text-4xl font-bold leading-tight mb-8">
						"The standard for blockchain academic verification."
					</h2>

					<div className="space-y-6">
						<div className="flex gap-4 items-start">
							<div className="mt-1 bg-blue-500/20 p-1 rounded-full">
								<CheckCircle2 className="w-4 h-4 text-blue-400" />
							</div>
							<p className="text-slate-300 text-lg leading-relaxed">
								Anchoring our degree issuance to the blockchain
								has completely eliminated credential fraud and
								reduced verification time by 99%.
							</p>
						</div>

						{/* Author */}
						<div className="flex items-center gap-4 pt-4 border-t border-white/10">
							<div className="size-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-slate-400">
								JA
							</div>
							<div>
								<p className="font-bold text-white">
									Dr. James Alistair
								</p>
								<p className="text-sm text-slate-400">
									Dean of Admissions, Oxford Brookes
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="relative z-10 text-xs text-slate-500 flex justify-between w-full max-w-xl">
					<span>© 2026 Certus System</span>
					<div className="flex gap-4">
						<span className="flex items-center gap-1">
							<Lock className="size-3" /> 256-bit Secure SSL
						</span>
					</div>
				</div>
			</div>

			{/* --- RIGHT COLUMN: Login Form --- */}
			<div className="w-full lg:w-1/2 flex flex-col relative bg-white lg:bg-transparent">
				{/* Top Navigation */}
				<div className="absolute top-8 left-8 lg:left-auto lg:right-12">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--button-primary)] transition-colors"
					>
						<ArrowLeft className="size-4" /> Back to Website
					</Link>
				</div>

				<div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24">
					<div className="w-full max-w-sm space-y-8">
						{/* Header */}
						<div className="space-y-2">
							<h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900">
								Admin Portal
							</h1>
							<p className="text-slate-500">
								Enter your credentials to access the registry.
							</p>
						</div>

						{/* Error Alert */}
						{error && (
							<div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
								<div className="size-1.5 rounded-full bg-red-500" />
								{error}
							</div>
						)}

						<form className="space-y-6" onSubmit={handleLogin}>
							{/* Email */}
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="email"
								>
									Work Email
								</label>
								<input
									id="email"
									type="email"
									placeholder="admin@university.edu"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
								/>
							</div>

							{/* Password */}
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<label
										className="text-sm font-medium leading-none"
										htmlFor="password"
									>
										Password
									</label>
									<a
										href="#"
										className="text-xs font-medium text-[var(--button-primary)] hover:underline"
									>
										Forgot password?
									</a>
								</div>
								<div className="relative">
									<input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-all"
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
									>
										{showPassword ? (
											<EyeOff size={16} />
										) : (
											<Eye size={16} />
										)}
									</button>
								</div>
							</div>

							{/* Submit */}
							<button
								type="submit"
								disabled={isLoading}
								className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[var(--button-primary)] text-white hover:opacity-90 h-11 px-4 w-full shadow-lg shadow-blue-500/20"
							>
								{isLoading ? (
									<>
										<Spinner className="mr-2 h-4 w-4" />{" "}
										Authenticating...
									</>
								) : (
									"Sign In"
								)}
							</button>
						</form>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-slate-200" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white lg:bg-[#f6f6f8] px-2 text-slate-400">
									Protected Area
								</span>
							</div>
						</div>

						<p className="text-center text-xs text-slate-500">
							By clicking continue, you agree to our{" "}
							<a
								href="#"
								className="underline hover:text-slate-800"
							>
								Terms of Service
							</a>{" "}
							and{" "}
							<a
								href="#"
								className="underline hover:text-slate-800"
							>
								Privacy Policy
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
