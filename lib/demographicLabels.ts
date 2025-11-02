export const AGE_LABELS: Record<string, string> = {
	"under-25": "Under 25 years",
	"25-34": "25–34 years",
	"35-44": "35–44 years",
	"45-54": "45–54 years",
	"55-64": "55–64 years",
	"65-plus": "65 years of age or older",
};

export const GENDER_LABELS: Record<string, string> = {
	female: "Female",
	male: "Male",
	miscellaneous: "Miscellaneous",
	"prefer-not-to-say": "Prefer not to say",
};

export const EDUCATION_LABELS: Record<string, string> = {
	"secondary-1": "Secondary level I (e.g. Realschule, Sekundarschule)",
	"secondary-2": "Secondary level II (e.g. grammar school, vocational baccalaureate, Matura)",
	vocational: "Vocational training / apprenticeship",
	bachelor: "Bachelor",
	master: "Masters degree",
	doctorate: "Doctorate / Doctorate",
	other: "Other degree",
};

export const formatDemographicValue = (field: string, value: string): string => {
	switch (field) {
		case "age_category":
			return AGE_LABELS[value] || value;
		case "gender":
			return GENDER_LABELS[value] || value;
		case "education":
			return EDUCATION_LABELS[value] || value;
		case "nationality":
			return value
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		case "occupation":
			return value
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		default:
			return value;
	}
};

