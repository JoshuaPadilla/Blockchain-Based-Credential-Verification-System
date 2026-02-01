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
	CheckCircle2,
	Database,
	Globe,
	Lock,
	Search,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	beforeLoad: ({ context }) => {
		if (context.auth.user?.role === Role.ADMIN) {
			throw redirect({ to: "/admin" });
		}
		// if (context.auth.user?.role === Role.SIGNER) {
		//     throw redirect({ to: "/signer" });
		// }
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
		<div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
			{/* --- Navbar --- */}
			<header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<img src={app_logo} className="size-10" />
						<span className="font-heading font-bold text-xl tracking-tight">
							Cer
							<span className="text-[var(--button-primary)]">
								tus
							</span>
						</span>
					</div>

					<div className="flex items-center gap-4">
						<Link
							to="/login"
							className="inline-flex h-9 items-center justify-center rounded-md bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50"
						>
							Staff Login
						</Link>
					</div>
				</div>
			</header>

			{/* --- Hero Section --- */}
			<main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 relative overflow-hidden">
				{/* Background Decoration */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--button-primary)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

				<div className="relative z-10 max-w-3xl mx-auto space-y-8">
					<div className="space-y-4">
						<div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm mb-4">
							<span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
							Blockchain Mainnet Live
						</div>

						<h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
							The Standard for <br />
							<span className="text-[var(--button-primary)]">
								Digital Academic Integrity
							</span>
						</h1>

						<p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
							Issue, Anchor, and Verify academic records on the
							blockchain. Immutable proof of education for
							students, instant verification for employers.
						</p>
					</div>

					{/* --- Public Verification Search --- */}
					<div className="w-full max-w-lg mx-auto bg-white p-2 rounded-xl shadow-lg border border-slate-100 mt-8">
						<form onSubmit={handleSearch} className="flex gap-2">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
								<input
									type="text"
									placeholder="Enter Credential Reference ID (e.g. CRED-8823)"
									className="w-full h-12 pl-10 pr-4 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-[var(--button-primary)] focus:ring-0 transition-all text-sm outline-none"
									value={refId}
									onChange={(e) => setRefId(e.target.value)}
								/>
							</div>
							<button
								type="submit"
								className="h-12 px-6 rounded-lg bg-[var(--button-primary)] text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
							>
								Verify <ArrowRight className="size-4" />
							</button>
						</form>
					</div>

					<div className="pt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
						<div className="flex items-center gap-2">
							<CheckCircle2 className="size-4 text-green-500" />{" "}
							Tamper-proof
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle2 className="size-4 text-green-500" />{" "}
							Globally Accessible
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle2 className="size-4 text-green-500" />{" "}
							Instant
						</div>
					</div>
				</div>
			</main>

			{/* --- Features Grid --- */}
			<section className="border-t border-border bg-slate-50/50 py-24">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-8">
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
			<footer className="border-t border-border py-8 bg-white text-center">
				<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
					<p>© 2026 Certus System. All rights reserved.</p>
					<div className="flex gap-6 mt-4 md:mt-0">
						<Link
							to="/login"
							className="hover:text-[var(--button-primary)] transition-colors"
						>
							Admin Portal
						</Link>
						<a
							href="#"
							className="hover:text-[var(--button-primary)] transition-colors"
						>
							Documentation
						</a>
						<a
							href="#"
							className="hover:text-[var(--button-primary)] transition-colors"
						>
							Privacy
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}

// Simple internal component for the feature cards
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
		<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
			<div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
				<Icon className="size-6" />
			</div>
			<h3 className="font-heading font-bold text-lg mb-2">{title}</h3>
			<p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
		</div>
	);
}
