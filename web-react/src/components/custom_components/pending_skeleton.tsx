import { Skeleton } from "@/components/ui/skeleton";

export function PendingSkeleton() {
	return (
		// Added 'w-full' to ensure it fills the container width
		<div className="flex w-full flex-col space-y-6 p-8">
			{/* Header Area */}
			<div className="space-y-2">
				{/* Added 'bg-slate-200' to force visibility */}
				<Skeleton className="h-10 w-[300px] bg-slate-200 dark:bg-slate-800" />
				<Skeleton className="h-4 w-[250px] bg-slate-200 dark:bg-slate-800" />
			</div>

			{/* Cards Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Skeleton className="h-[120px] rounded-xl bg-slate-200 dark:bg-slate-800" />
				<Skeleton className="h-[120px] rounded-xl bg-slate-200 dark:bg-slate-800" />
				<Skeleton className="h-[120px] rounded-xl bg-slate-200 dark:bg-slate-800" />
				<Skeleton className="h-[120px] rounded-xl bg-slate-200 dark:bg-slate-800" />
			</div>

			{/* Main Content Area */}
			<div className="h-[400px] w-full rounded-xl border p-4">
				<div className="space-y-4">
					<Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-800" />
					<Skeleton className="h-4 w-[90%] bg-slate-200 dark:bg-slate-800" />
					<Skeleton className="h-4 w-[80%] bg-slate-200 dark:bg-slate-800" />
				</div>
			</div>
		</div>
	);
}
