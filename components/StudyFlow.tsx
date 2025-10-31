"use client";

import { useState, useEffect } from "react";
import ConsentPage from "@/components/ConsentPage";
import DemographicsPage from "@/components/DemographicsPage";
import AttariQuestionnaire from "@/components/AttariQuestionnaire";
import TaiQuestionnaire from "@/components/TaiQuestionnaire";
import ScreeningPage from "@/components/ScreeningPage";
import PreRandomizationPage from "@/components/PreRandomizationPage";
import ChatPage from "@/components/ChatPage";
import PostTestPage from "@/components/PostTestPage";
import ThankYouPage from "@/components/ThankYouPage";
import { api, type DemographicData, type AttariData, type TaiData } from "@/lib/api";

const STORAGE_KEY = "psych-study-progress";

interface SavedProgress {
	currentStep: StudyStep;
	participantId: string | null;
	demographicData: DemographicData | null;
	attariData: AttariData | null;
	taiData: TaiData | null;
	screeningText: string;
	baselineUse: number;
	condition: "control" | "experimental" | null;
	postUse: number;
	postChange: string;
}

export type StudyStep =
	| "consent"
	| "demographics"
	| "attari"
	| "tai"
	| "screening"
	| "pre-randomization"
	| "chat"
	| "post-test"
	| "thank-you";

export default function StudyFlow() {
	const [currentStep, setCurrentStep] = useState<StudyStep>("consent");
	const [participantId, setParticipantId] = useState<string | null>(null);
	const [demographicData, setDemographicData] = useState<DemographicData | null>(null);
	const [attariData, setAttariData] = useState<AttariData | null>(null);
	const [taiData, setTaiData] = useState<TaiData | null>(null);
	const [screeningText, setScreeningText] = useState("");
	const [baselineUse, setBaselineUse] = useState(50);
	const [condition, setCondition] = useState<"control" | "experimental" | null>(null);
	const [postUse, setPostUse] = useState(50);
	const [postChange, setPostChange] = useState("");
	const [isInitialized, setIsInitialized] = useState(false);

	// Load saved progress on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				try {
					const progress: SavedProgress = JSON.parse(saved);
					setCurrentStep(progress.currentStep);
					setParticipantId(progress.participantId);
					setDemographicData(progress.demographicData);
					setAttariData(progress.attariData);
					setTaiData(progress.taiData);
					setScreeningText(progress.screeningText);
					setBaselineUse(progress.baselineUse);
					setCondition(progress.condition);
					setPostUse(progress.postUse);
					setPostChange(progress.postChange);
				} catch (error) {
					console.error("Failed to load saved progress:", error);
				}
			}
			setIsInitialized(true);
		}
	}, []);

	// Save progress whenever state changes (after initialization)
	useEffect(() => {
		if (!isInitialized || typeof window === "undefined") return;

		const progress: SavedProgress = {
			currentStep,
			participantId,
			demographicData,
			attariData,
			taiData,
			screeningText,
			baselineUse,
			condition,
			postUse,
			postChange,
		};

		// Don't save on thank-you page (study is complete)
		if (currentStep !== "thank-you") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
		} else {
			// Clear saved progress when study is complete
			localStorage.removeItem(STORAGE_KEY);
		}
	}, [
		currentStep,
		participantId,
		demographicData,
		attariData,
		taiData,
		screeningText,
		baselineUse,
		condition,
		postUse,
		postChange,
		isInitialized,
	]);

	const handleConsent = async () => {
		try {
			// Create participant with empty demographics initially (will be filled in later)
			const result = await api.createParticipant({
				consent_at: new Date().toISOString(),
				demographic: {
					age: "",
					gender: "",
					nationality: "",
					education: "",
					occupation: "",
					recruitment_experience: false,
				},
			});
			setParticipantId(result.participant_id);
			setCurrentStep("demographics");
		} catch (error) {
			console.error("Error creating participant:", error);
			alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
		}
	};

	const handleDemographicsComplete = () => {
		setCurrentStep("attari");
	};

	const handleAttariComplete = () => {
		setCurrentStep("tai");
	};

	const handleTaiComplete = async () => {
		if (!participantId || !attariData || !taiData) return;

		try {
			await api.saveScales({
				participant_id: participantId,
				attari: attariData,
				tai: taiData,
			});
			setCurrentStep("screening");
		} catch (error) {
			console.error("Error saving scales:", error);
			alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
		}
	};

	const handleScreeningComplete = async () => {
		if (!participantId) return;

		try {
			const result = await api.screening({
				participant_id: participantId,
				screening_text: screeningText,
				baseline_use: baselineUse,
			});

			if (result.excluded) {
				alert("You indicated no concerns — excluded from study");
				return;
			}

			setCondition(result.condition);
			setCurrentStep("pre-randomization");
		} catch (error) {
			console.error("Error in screening:", error);
			alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
		}
	};

	const handlePreRandomizationComplete = () => {
		setCurrentStep("chat");
	};

	const handleChatComplete = () => {
		setCurrentStep("post-test");
	};

	const handlePostTestComplete = async () => {
		if (!participantId) return;

		try {
			await api.complete({
				participant_id: participantId,
				post_use: postUse,
				post_change: postChange,
			});
			setCurrentStep("thank-you");
		} catch (error) {
			console.error("Error completing study:", error);
			alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
		}
	};

	// Show loading state while initializing
	if (!isInitialized) {
		return (
			<div className='max-w-4xl mx-auto'>
				<div className='card'>
					<div className='flex items-center justify-center py-12'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='max-w-4xl mx-auto'>
			{currentStep === "consent" && (
				<ConsentPage
					onStart={handleConsent}
					demographicData={demographicData}
					setDemographicData={setDemographicData}
				/>
			)}

			{currentStep === "demographics" && (
				<DemographicsPage
					demographicData={demographicData}
					setDemographicData={setDemographicData}
					onComplete={handleDemographicsComplete}
				/>
			)}

			{currentStep === "attari" && (
				<AttariQuestionnaire attariData={attariData} setAttariData={setAttariData} onComplete={handleAttariComplete} />
			)}

			{currentStep === "tai" && (
				<TaiQuestionnaire taiData={taiData} setTaiData={setTaiData} onComplete={handleTaiComplete} />
			)}

			{currentStep === "screening" && (
				<ScreeningPage
					screeningText={screeningText}
					setScreeningText={setScreeningText}
					baselineUse={baselineUse}
					setBaselineUse={setBaselineUse}
					onComplete={handleScreeningComplete}
				/>
			)}

			{currentStep === "pre-randomization" && <PreRandomizationPage onComplete={handlePreRandomizationComplete} />}

			{currentStep === "chat" && participantId && condition && (
				<ChatPage participantId={participantId} condition={condition} onComplete={handleChatComplete} />
			)}

			{currentStep === "post-test" && (
				<PostTestPage
					postUse={postUse}
					setPostUse={setPostUse}
					postChange={postChange}
					setPostChange={setPostChange}
					onComplete={handlePostTestComplete}
				/>
			)}

			{currentStep === "thank-you" && <ThankYouPage />}
		</div>
	);
}
