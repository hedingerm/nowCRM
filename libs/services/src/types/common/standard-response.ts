export interface StandardResponse<T> {
	data: T | null;
	status: number;
	success: boolean;
	errorMessage?: string;
	meta?: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}
