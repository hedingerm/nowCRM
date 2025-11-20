import type { Asset } from "../client";
import type { BaseFormType, BaseType } from "./common/base-type";

interface UserRole {
	id: number;
	name: string;
}

export interface User extends BaseType {
	username: string;
	is2FAEnabled?: boolean;
	totpSecret?: string;
	email: string;
	jwt_token: string;
	role: UserRole;
	image: Asset;
}

export interface Form_User extends BaseFormType {
	username: string;
	is2FAEnabled?: boolean;
	totpSecret?: string;
	email: string;
	jwt_token: string;
	role: UserRole;
	image: Asset;
}

export type strapi_user = {
	jwt: string;
	user: {
		id: string; // here is not number since next-auth doesnt provde overriding
		name: string;
		username: string;
		role: any;
		email: string;
		confirmed: boolean;
		blocked: boolean;
		createdAt: string;
		updatedAt: string;
		image: any;
		jwt_token: string;
		is2FAEnabled?: boolean;
		totpSecret?: string;
	};
};
