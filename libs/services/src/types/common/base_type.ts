// all entities in strapi have this field except name(name we ommit when it not used for entity)
export interface BaseType {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface BaseFormType {
	name: string;
	publishedAt: Date;
}
