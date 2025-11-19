import LoadingComponent from "@/components/loading-component";

export default function loading() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<LoadingComponent />
		</div>
	);
}
