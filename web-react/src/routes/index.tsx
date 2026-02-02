import app_logo from "@/assets/img/app_logo.png";
import { Role } from "@/enums/user_role.enum";
import {
	Link,
	createFileRoute,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import {
	ArrowRight,
	Database,
	Globe,
	Lock,
	Search,
	ShieldCheck,
	Zap,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	beforeLoad: ({ context }) => {
		if (context.auth.user?.role === Role.ADMIN) {
			throw redirect({ to: "/admin" });
		}
		if (context.auth.user?.role === Role.SIGNER) {
			throw redirect({ to: "/signer" });
		}
	},
});

function HomeComponent() {
	const navigate = useNavigate();
	const [refId, setRefId] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!refId.trim()) return;
		navigate({ to: `/verify/${refId}` });
	};

	return (
		<div className="min-h-screen bg-slate-50 font-sans flex flex-col">
			{/* --- Navbar (Dark Theme) --- */}
			<header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<img
							src={app_logo}
							className="size-9"
							alt="Certus Logo"
						/>
						<span className="font-heading font-bold text-xl tracking-tight text-white">
							Cer
							<span className="text-[var(--button-primary)]">
								tus
							</span>
						</span>
					</div>

					<div className="flex items-center gap-4">
						<Link
							to="/login"
							className="inline-flex h-9 items-center justify-center rounded-full bg-white/10 border border-white/10 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
						>
							Staff Portal
						</Link>
					</div>
				</div>
			</header>

			{/* --- Hero Section (Matches Login Left Panel) --- */}
			<main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
				{/* Abstract Background Decoration */}
				<div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
				<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[100px] opacity-10 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

				{/* Grid Pattern Overlay */}
				<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

				<div className="container relative z-10 mx-auto px-4 text-center">
					<div className="max-w-4xl mx-auto space-y-8">
						{/* Badge */}
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
							<span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 shadow-sm backdrop-blur-sm">
								<span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
								Official Blockchain Mainnet Live
							</span>
						</div>

						{/* Heading */}
						<h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
							The Standard for <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
								Academic Integrity
							</span>
						</h1>

						{/* Subtext */}
						<p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
							Issue, Anchor, and Verify academic records on the
							blockchain. Immutable proof of education for
							students, instant verification for employers.
						</p>

						{/* --- Search Component --- */}
						<div className="w-full max-w-xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
							<div className="bg-white/5 backdrop-blur-sm p-2 rounded-2xl border border-white/10 shadow-2xl shadow-indigo-500/10">
								<form
									onSubmit={handleSearch}
									className="flex gap-2"
								>
									<div className="relative flex-1 group">
										<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-indigo-400 transition-colors" />
										<input
											type="text"
											placeholder="Enter Credential Reference ID (e.g. CRED-8823)"
											className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-900/50 border border-transparent text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-indigo-500/50 focus:ring-0 transition-all text-base outline-none"
											value={refId}
											onChange={(e) =>
												setRefId(e.target.value)
											}
										/>
									</div>
									<button
										type="submit"
										className="h-14 px-8 rounded-xl bg-[var(--button-primary)] text-white font-semibold hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
									>
										Verify Now{" "}
										<ArrowRight className="size-4" />
									</button>
								</form>
							</div>

							{/* Trust Indicators */}
							<div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
								<div className="flex items-center gap-2">
									<ShieldCheck className="size-4 text-emerald-400" />
									Tamper-proof
								</div>
								<div className="flex items-center gap-2">
									<Globe className="size-4 text-blue-400" />
									Globally Accessible
								</div>
								<div className="flex items-center gap-2">
									<Zap className="size-4 text-amber-400" />
									Instant Verification
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* --- Features Grid (Light Contrast) --- */}
			<section className="relative z-20 -mt-8 py-20 bg-slate-50">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
						<FeatureCard
							icon={Database}
							title="Immutable Records"
							desc="Once issued, records are anchored to the blockchain. They cannot be altered, deleted, or forged by anyone."
						/>
						<FeatureCard
							icon={Globe}
							title="Global Availability"
							desc="Verification is decentralized. Employers and institutions can verify credentials from anywhere, anytime."
						/>
						<FeatureCard
							icon={Lock}
							title="Cryptographic Security"
							desc="We use SHA-256 hashing and digital signatures to ensure that the data you see is exactly what was issued."
						/>
					</div>
				</div>
			</section>

			{/* --- Footer --- */}
			<footer className="border-t border-slate-200 py-12 bg-white">
				<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
					<div className="flex items-center gap-2 mb-4 md:mb-0">
						<img
							src={app_logo}
							className="size-6 grayscale opacity-50"
						/>
						<p>© 2026 Certus System. All rights reserved.</p>
					</div>

					<div className="flex gap-8">
						<Link
							to="/login"
							className="hover:text-slate-900 transition-colors"
						>
							Admin Portal
						</Link>
						<a
							href="#"
							className="hover:text-slate-900 transition-colors"
						>
							Documentation
						</a>
						<a
							href="#"
							className="hover:text-slate-900 transition-colors"
						>
							Privacy Policy
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}

// Internal Component for Features
function FeatureCard({
	icon: Icon,
	title,
	desc,
}: {
	icon: any;
	title: string;
	desc: string;
}) {
	return (
		<div className="group relative flex flex-col items-start p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 top-0 hover:-top-1">
			<div className="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 mb-6 group-hover:bg-[var(--button-primary)] group-hover:text-white transition-colors duration-300">
				<Icon className="size-6" />
			</div>
			<h3 className="font-heading font-bold text-lg mb-3 text-slate-900">
				{title}
			</h3>
			<p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
		</div>
	);
}
