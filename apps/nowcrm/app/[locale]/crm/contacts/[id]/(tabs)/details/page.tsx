import type { DocumentId } from "@nowcrm/services";
import { contactsService } from "@nowcrm/services/server";
import { auth } from "@/auth";
import ErrorMessage from "@/components/error-message";
import { AddressCard } from "./components/addressInfo/adress-info";
import { PersonalInfoCard } from "./components/personalInfo/personal-info";
import { ProfessionalInfoCard } from "./components/professionalInfo/proff-information";

export default async function Home(props: {
	params: Promise<{ id: DocumentId }>;
}) {
	const params = await props.params;
	const session = await auth();
	const contact = await contactsService.findOne(params.id, session?.jwt, {
		populate: "*",
	});

	if (!contact.data || !contact.success) {
		return <ErrorMessage response={contact} />;
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			<PersonalInfoCard contact={contact.data} />
			<AddressCard contact={contact.data} />
			<ProfessionalInfoCard contact={contact.data} />
		</div>
	);
}
