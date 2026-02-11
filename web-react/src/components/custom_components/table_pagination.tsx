import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalResults: number;
	onPageChange: (page: number) => void;
}

export function DataTablePagination({
	currentPage,
	totalPages,
	pageSize,
	totalResults,
	onPageChange,
}: DataTablePaginationProps) {
	const startResult = (currentPage - 1) * pageSize + 1;
	const endResult = Math.min(currentPage * pageSize, totalResults);

	const getPageNumbers = () => {
		const pages = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			// Basic logic to show 1, 2, 3 ... lastPage
			pages.push(1, 2, 3, "...", totalPages);
		}
		return pages;
	};

	return (
		<div className="space-y-6">
			{/* Navigation Row */}
			<div className="flex items-center space-x-2">
				<Button
					variant="outline"
					size="icon"
					className="h-10 w-10 rounded-md border-gray-200"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-5 w-5 text-gray-400" />
				</Button>

				{getPageNumbers().map((page, index) => (
					<Button
						key={index}
						variant={currentPage === page ? "default" : "outline"}
						className={`h-10 w-10 rounded-md border-gray-200 text-sm font-medium ${
							currentPage === page
								? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
								: "text-gray-600 hover:bg-gray-50"
						}`}
						onClick={() =>
							typeof page === "number" && onPageChange(page)
						}
						disabled={page === "..."}
					>
						{page}
					</Button>
				))}

				<Button
					variant="outline"
					size="icon"
					className="h-10 w-10 rounded-md border-gray-200"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className="h-5 w-5 text-gray-400" />
				</Button>

				{/* Results Text Row */}

				<div className="text-sm font-semibold text-black/60 ">
					Results: {startResult} - {endResult} of {totalResults}
				</div>
			</div>
		</div>
	);
}
