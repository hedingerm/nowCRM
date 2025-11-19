import type { Session } from "next-auth";
import { RowData } from "@tanstack/react-table";
import { DocumentId } from "@nowcrm/services";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    session: Session | null;
	step_id?: DocumentId;
	refreshData?: () => void;
  }
}