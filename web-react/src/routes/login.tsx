import { createFileRoute, redirect } from "@tanstack/react-router";
import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { useAuthStore } from "@/stores/auth_store";

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
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className="flex min-h-screen w-full font-sans">
			{/* LEFT COLUMN: Branding & Testimonial */}
			<div className="hidden lg:flex w-1/2 bg-[#0f172a] text-white flex-col justify-between p-12 relative overflow-hidden">
				{/* Background texture (optional subtle effect) */}
				<div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent" />

				{/* Logo */}
				<div className="flex items-center gap-2 z-10">
					<div className="bg-white/10 p-1.5 rounded-md">
						<ShieldCheck className="w-6 h-6 text-white" />
					</div>
					<span className="font-semibold text-xl tracking-tight">
						CredentialChain
					</span>
				</div>

				{/* Main Content */}
				<div className="max-w-lg z-10">
					<div className="w-12 h-1 bg-blue-500 mb-8 rounded-full"></div>
					<h1 className="text-4xl font-bold leading-tight mb-6">
						Securing the future of academic integrity.
					</h1>
					<p className="text-gray-300 text-lg mb-8 leading-relaxed">
						"CredentialChain gives our faculty the confidence to
						verify degrees instantly, eliminating fraud and
						streamlining the admissions process globally."
					</p>

					{/* Profile */}
					<div className="flex items-center gap-4">
						<img
							src="/api/placeholder/48/48"
							alt="Dr. James Alistair"
							className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
						/>
						<div>
							<p className="font-semibold text-white">
								Dr. James Alistair
							</p>
							<p className="text-sm text-gray-400">
								Dean of Admissions, Oxford Brookes
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-between text-xs text-gray-500 z-10">
					<p>© 2024 CredentialChain Systems.</p>
					<div className="flex gap-4">
						<a
							href="#"
							className="hover:text-white transition-colors"
						>
							Privacy
						</a>
						<a
							href="#"
							className="hover:text-white transition-colors"
						>
							Terms
						</a>
					</div>
				</div>
			</div>

			{/* RIGHT COLUMN: Login Form */}
			<div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-12">
				<div className="w-full max-w-md">
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Log in to your account
						</h2>
						<p className="text-gray-500">
							Secure access for University Administrators and
							Faculty members.
						</p>
					</div>

					<form
						className="space-y-5"
						onSubmit={(e) => e.preventDefault()}
					>
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-semibold text-gray-700 mb-1.5"
							>
								Work Email
							</label>
							<input
								id="email"
								type="email"
								placeholder="name@university.edu"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
							/>
						</div>

						{/* Password Field */}
						<div>
							<div className="flex justify-between items-center mb-1.5">
								<label
									htmlFor="password"
									className="block text-sm font-semibold text-gray-700"
								>
									Password
								</label>
								<a
									href="#"
									className="text-sm font-semibold text-blue-600 hover:text-blue-700"
								>
									Forgot password?
								</a>
							</div>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 pr-10"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? (
										<EyeOff size={20} />
									) : (
										<Eye size={20} />
									)}
								</button>
							</div>
						</div>

						{/* Remember Me */}
						<div className="flex items-center">
							<input
								id="remember"
								type="checkbox"
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="remember"
								className="ml-2 block text-sm text-gray-600"
							>
								Remember this device for 30 days
							</label>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full bg-[#0f172a] text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
						>
							Sign in to Dashboard
						</button>
					</form>

					{/* Secure Divider */}
					<div className="my-8 relative text-center">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200"></div>
						</div>
						<div className="relative inline-block bg-white px-4 text-xs text-gray-400 uppercase tracking-wider">
							Protected Area
						</div>
					</div>

					<div className="flex justify-center items-center gap-2 text-gray-400 text-xs mb-12">
						<Lock size={12} />
						<span>256-bit Encryption • SSO Enabled</span>
					</div>

					{/* Bottom Link */}
					<div className="text-center text-sm text-gray-500">
						Don't have an account?{" "}
						<a
							href="#"
							className="font-semibold text-blue-600 hover:text-blue-700"
						>
							Contact IT Support
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
