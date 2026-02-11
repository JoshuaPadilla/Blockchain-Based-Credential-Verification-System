import { Skeleton } from "../ui/skeleton";

export const TableSkeleton = () => {
	return (
		<div className="rounded-md border border-slate-200 bg-white p-4">
			<div className="space-y-4">
				{/* Table Header Mock */}
				<div className="flex items-center justify-between pb-4 border-b border-slate-100">
					<Skeleton className="h-8 w-[200px] bg-slate-100" />
					<Skeleton className="h-8 w-[100px] bg-slate-100" />
				</div>
				{/* Rows Mock */}
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex items-center space-x-4 py-2">
						<Skeleton className="h-10 w-10 rounded-full bg-slate-100" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-[80%] bg-slate-100" />
							<Skeleton className="h-4 w-[60%] bg-slate-100" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
