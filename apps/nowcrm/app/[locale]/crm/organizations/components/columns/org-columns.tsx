"use client";
import type { Organization } from "@nowcrm/services";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import toast from "react-hot-toast";
import { SortableHeader } from "@/components/dataTable/sortable-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteConfig } from "@/lib/config/routes-config";
import { formatDateTimeStrapi } from "@/lib/strapi-date";
import { TagsCell } from "../../../../../../components/dataTable/shared_cols/tags/tag-cell";
import { TagFilterHeader } from "../../../../../../components/dataTable/shared_cols/tags/tag-filter-header";

const ViewActions: React.FC<{
	organization: Organization;
	onRefetch?: () => void;
}> = ({ organization, onRefetch }) => {
	const router = useRouter();

	return (
		<div className="text-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<Link
						href={`${RouteConfig.organizations.single.base(organization.documentId)}`}
					>
						<DropdownMenuItem>View organization</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={async () => {
							const { duplicateOrganizationAction } = await import(
								"@/lib/actions/organizations/duplicate-organization"
							);
							const res = await duplicateOrganizationAction(
								organization.documentId,
							);
							if (!res.success) {
								toast.error(
									res.errorMessage ?? "Failed to duplicate organization",
								);
								return;
							}
							toast.success("Organization duplicated");
							if (onRefetch) {
								onRefetch();
							} else {
								router.refresh();
							}
						}}
					>
						Duplicate
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={async () => {
							const { deleteOrganizationAction } = await import(
								"@/lib/actions/organizations/delete-organization"
							);
							const res = await deleteOrganizationAction(
								organization.documentId,
							);
							if (!res.success) {
								toast.error(
									res.errorMessage ?? "Failed to delete organization",
								);
								return;
							}
							toast.success("Organization deleted");
							if (onRefetch) {
								onRefetch();
							} else {
								router.refresh();
							}
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export const getColumns = (
	session?: Session | null,
	onRefetch?: () => void,
): ColumnDef<Organization>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex h-full items-center">
				<Checkbox
					className="leading-0"
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex h-full items-center">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <SortableHeader column={column} label="Created" />,
		cell: ({ row }) => {
			return <div>{formatDateTimeStrapi(row.original.createdAt)}</div>;
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => <SortableHeader column={column} label="Updated" />,
		cell: ({ row }) => {
			return <div>{formatDateTimeStrapi(row.original.updatedAt)}</div>;
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Name" />,
		enableHiding: false,
		cell: ({ row, cell }) => {
			const organization = row.original;
			return (
				<Link
					href={`${RouteConfig.organizations.single.base(organization.documentId)}`}
					className="whitespace-nowrap font-medium hover:underline"
				>
					{cell.renderValue() as any}
				</Link>
			);
		},
	},
	{
		accessorKey: "organization_type",
		header: "Organization Type",
		cell: ({ row }) => {
			const organization = row.original;
			return <div>{organization.organization_type?.name}</div>;
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "tags",
		header: () => (
			<TagFilterHeader session={session} entityName="organizations" />
		),
		cell: ({ row }) => {
			const tags = row.original.tags || [];
			return (
				<TagsCell
					serviceName="organizationsService"
					entityId={row.original.documentId}
					initialTags={tags}
				/>
			);
		},
	},
	{
		accessorKey: "contact_person",
		header: ({ column }) => (
			<SortableHeader column={column} label="Contact Person" />
		),
	},
	{
		accessorKey: "address_line1",
		header: "Address line",
	},

	{
		accessorKey: "location",
		header: ({ column }) => <SortableHeader column={column} label="Location" />,
	},
	{
		accessorKey: "contacts",
		header: "Contacts",
		cell: ({ row }) => {
			const organization = row.original;
			const names = organization.contacts
				.map((item) => item.first_name)
				.join(", ");
			return <p>{names}</p>;
		},
	},
	{
		accessorKey: "frequency",
		header: "Frequency",
		cell: ({ row }) => {
			const organization = row.original;
			return <div>{organization.frequency?.name}</div>;
		},
	},
	{
		accessorKey: "media_type",
		header: "Media Type",
		cell: ({ row }) => {
			const organization = row.original;
			return <div>{organization.media_type?.name}</div>;
		},
	},
	{
		accessorKey: "zip",
		header: "ZIP",
	},
	{
		accessorKey: "canton",
		header: ({ column }) => <SortableHeader column={column} label="Canton" />,
	},
	{
		accessorKey: "country",
		header: ({ column }) => <SortableHeader column={column} label="Country" />,
	},
	{
		accessorKey: "url",
		header: "URL",
	},
	{
		accessorKey: "twitter_url",
		header: "Twitter(X) URL",
	},
	{
		accessorKey: "facebook_url",
		header: "Facebook URL",
	},
	{
		accessorKey: "whatsapp_channel",
		header: "Whatsapp Channel",
	},
	{
		accessorKey: "linkedin_url",
		header: "Linkedin URL",
	},
	{
		accessorKey: "telegram_url",
		header: "Telegram URL",
	},
	{
		accessorKey: "telegram_channel",
		header: "Telegram Channel",
	},
	{
		accessorKey: "instagram_url",
		header: "Instagram URL",
	},
	{
		accessorKey: "tiktok_url",
		header: "TikTok URL",
	},
	{
		accessorKey: "whatsapp_phone",
		header: "WhatsApp Phone",
	},
	{
		accessorKey: "phone",
		header: "Phone",
	},
	{
		accessorKey: "tag",
		header: "Tag",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "language",
		header: "Language",
	},
	{
		accessorKey: "sources",
		header: "Sources",
		cell: ({ row }) => {
			const organization = row.original;
			const names = organization.sources.map((item) => item.name).join(", ");
			return <p>{names}</p>;
		},
	},
	{
		accessorKey: "industry",
		header: "Industry",
		cell: ({ row }) => {
			const organization = row.original;
			return <div>{organization.industry?.name}</div>;
		},
	},
	{
		id: "actions",
		header: ({ column }) => <div className="text-center">Actions</div>,
		cell: ({ row }) => {
			const contact = row.original;
			return <ViewActions organization={contact} onRefetch={onRefetch} />;
		},
	},
];
