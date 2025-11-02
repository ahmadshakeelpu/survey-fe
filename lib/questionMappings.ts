export const ATTARI_QUESTIONS_MAP: Record<string, { text: string; facet: string; valence: string }> = {
	attari_1: {
		text: "AI will make this world a better place.",
		facet: "Cognitive",
		valence: "Positive",
	},
	attari_2: {
		text: "I have strong negative emotions about AI.",
		facet: "Affective",
		valence: "Negative (reverse coded)",
	},
	attari_3: {
		text: "I want to use technologies that rely on AI.",
		facet: "Behavioral",
		valence: "Positive",
	},
	attari_4: {
		text: "AI has more disadvantages than advantages.",
		facet: "Cognitive",
		valence: "Negative (reverse coded)",
	},
	attari_5: {
		text: "I look forward to future AI developments.",
		facet: "Affective",
		valence: "Positive",
	},
	attari_6: {
		text: "AI offers solutions to many world problems.",
		facet: "Cognitive",
		valence: "Positive",
	},
	attari_7: {
		text: "I prefer technologies that do not feature AI.",
		facet: "Behavioral",
		valence: "Negative (reverse coded)",
	},
	attari_8: {
		text: "I am afraid of AI.",
		facet: "Affective",
		valence: "Negative (reverse coded)",
	},
	attari_9: {
		text: "I would rather choose a technology with AI than one without.",
		facet: "Behavioral",
		valence: "Positive",
	},
	attari_10: {
		text: "AI creates problems rather than solving them.",
		facet: "Cognitive",
		valence: "Negative (reverse coded)",
	},
	attari_11: {
		text: "When I think about AI, I have mostly positive feelings.",
		facet: "Affective",
		valence: "Positive",
	},
	attari_12: {
		text: "I would rather avoid technologies that are based on AI.",
		facet: "Behavioral",
		valence: "Negative (reverse coded)",
	},
};

export const TAI_QUESTIONS_MAP: Record<string, { text: string; category: string }> = {
	RCG1: {
		text: "Detect suitability of applicants.",
		category: "Recognition",
	},
	RCG2: {
		text: "Record suitability of applicants.",
		category: "Recognition",
	},
	RCG3: {
		text: "Identify suitability of applicants.",
		category: "Recognition",
	},
	PDC1: {
		text: "Forecast the development of suitability of applicants.",
		category: "Prediction",
	},
	PDC2: {
		text: "Predict the development of suitability of applicants.",
		category: "Prediction",
	},
	PDC3: {
		text: "Calculate the development of suitability of applicants.",
		category: "Prediction",
	},
	RCM1: {
		text: "Recommend hiring of applicants.",
		category: "Recommendation",
	},
	RCM2: {
		text: "Propose hiring of applicants.",
		category: "Recommendation",
	},
	RCM3: {
		text: "Suggest hiring of applicants.",
		category: "Recommendation",
	},
	DSM1: {
		text: "Decide on hiring of applicants.",
		category: "Decision Making",
	},
	DSM2: {
		text: "Define hiring of applicants.",
		category: "Decision Making",
	},
	DSM3: {
		text: "Preset hiring of applicants.",
		category: "Decision Making",
	},
};

export const getAttariQuestionText = (questionId: string): string => {
	return ATTARI_QUESTIONS_MAP[questionId]?.text || questionId;
};

export const getTaiQuestionText = (questionId: string): string => {
	return TAI_QUESTIONS_MAP[questionId]?.text || questionId;
};

