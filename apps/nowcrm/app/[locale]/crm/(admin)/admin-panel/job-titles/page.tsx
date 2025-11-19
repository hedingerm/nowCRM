import type { PaginationParams } from "@nowcrm/services";
import { contactJobTitlesService } from "@nowcrm/services/server";
import type { Session } from "next-auth";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import DataTable from "@/components/dataTable/data-table";
import ErrorMessage from "@/components/error-message";
import { columns } from "./components/columns/job-titles-columns";
import CreateJobTitleDialog from "./components/create-dialog";
import JobTitleMassActions from "./components/massActions/mass-actions";

export default async function Page(props: {
	searchParams: Promise<PaginationParams>;
}) {
	const t = await getTranslations("Admin.JobTitle");

	const searchParams = await props.searchParams;
	const {
		page = 1,
		pageSize = 10,
		search = "",
		sortBy = "id",
		sortOrder = "desc",
	} = searchParams;
	const session = await auth();
	const response = await contactJobTitlesService.find(session?.jwt, {
		populate: "*",
		sort: [`${sortBy}:${sortOrder}` as any],
		pagination: {
			page,
			pageSize,
		},
		filters: {
			$or: [{ name: { $containsi: search } }],
		},
	});
	// Handle the response based on success status
	if (!response.success || !response.data || !response.meta) {
		return <ErrorMessage response={response} />;
	}

	const { meta } = response;

	return (
		<DataTable
			data={response.data}
			columns={columns}
			table_name="job_titles"
			table_title={t("table_title")}
			mass_actions={JobTitleMassActions}
			createDialog={CreateJobTitleDialog}
			pagination={meta.pagination}
			session={session as Session}
			sorting={{ sortBy, sortOrder }}
		/>
	);
}
