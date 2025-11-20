import { redirect } from "next/navigation";
import { RouteConfig } from "@/lib/config/routes-config";

export default async function SignIn() {
	redirect(RouteConfig.contacts.base);
}
