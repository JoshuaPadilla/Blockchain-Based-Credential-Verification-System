import { StudentSelector } from "@/components/custom_components/combobox";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/students")({
	component: RouteComponent,
});

function RouteComponent() {
	const handleOnSelect = (id: string) => {
		console.log(id);
	};

	return <StudentSelector onSelect={handleOnSelect} />;
}
