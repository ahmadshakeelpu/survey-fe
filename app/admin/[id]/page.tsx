"use client";

import { useState, useEffect } from "react";
import { api, type Participant } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ATTARI_QUESTIONS_MAP, TAI_QUESTIONS_MAP } from "@/lib/questionMappings";
import { formatDemographicValue } from "@/lib/demographicLabels";

export default function ParticipantDetailPage({ params }: { params: { id: string } }) {
	const [participant, setParticipant] = useState<Participant | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const router = useRouter();

	useEffect(() => {
		const loadParticipant = async () => {
			const token = localStorage.getItem("admin-token");
			if (!token) {
				router.push("/admin");
				return;
			}

			setLoading(true);
			try {
				const result = await api.admin.getParticipant(params.id, token);
				setParticipant(result.participant);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load participant");
				if (err instanceof Error && err.message.includes("unauthorized")) {
					localStorage.removeItem("admin-token");
					router.push("/admin");
				}
			} finally {
				setLoading(false);
			}
		};

		loadParticipant();
	}, [params.id, router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (error || !participant) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="card max-w-md">
					<div className="text-red-600 mb-4">{error || "Participant not found"}</div>
					<button onClick={() => router.push("/admin")} className="btn-primary">
						Back to Dashboard
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<div className="mb-6">
					<button onClick={() => router.push("/admin")} className="text-blue-600 hover:text-blue-800 mb-4">
						← Back to Dashboard
					</button>
					<h1 className="text-3xl font-bold">Participant Details</h1>
					<p className="text-gray-600 font-mono mt-2">{participant.id}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="card">
						<h2 className="text-xl font-bold mb-4">Basic Information</h2>
						<div className="space-y-3">
							<div>
								<span className="font-semibold">Consent Date:</span>
								<span className="ml-2">
									{participant.consent_at
										? new Date(participant.consent_at).toLocaleString()
										: "N/A"}
								</span>
							</div>
							<div>
								<span className="font-semibold">Status:</span>
								<span
									className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
										participant.completed
											? "bg-green-100 text-green-800"
											: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{participant.completed ? "Completed" : "In Progress"}
								</span>
							</div>
							<div>
								<span className="font-semibold">Condition:</span>
								{participant.condition ? (
									<span
										className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
											participant.condition === "control"
												? "bg-blue-100 text-blue-800"
												: "bg-purple-100 text-purple-800"
										}`}
									>
										{participant.condition}
									</span>
								) : (
									<span className="ml-2 text-gray-400">Not assigned</span>
								)}
							</div>
						</div>
					</div>

					<div className="card">
						<h2 className="text-xl font-bold mb-4">Demographics</h2>
						<div className="space-y-3">
							<div className="border-b pb-2">
								<span className="font-semibold text-gray-700">Age:</span>
								<div className="mt-1 text-gray-900">
									{participant.age_category
										? formatDemographicValue("age_category", participant.age_category)
										: "N/A"}
								</div>
							</div>
							<div className="border-b pb-2">
								<span className="font-semibold text-gray-700">Gender:</span>
								<div className="mt-1 text-gray-900">
									{participant.gender
										? formatDemographicValue("gender", participant.gender)
										: "N/A"}
								</div>
							</div>
							<div className="border-b pb-2">
								<span className="font-semibold text-gray-700">Nationality:</span>
								<div className="mt-1 text-gray-900">
									{participant.nationality
										? formatDemographicValue("nationality", participant.nationality)
										: "N/A"}
								</div>
							</div>
							<div className="border-b pb-2">
								<span className="font-semibold text-gray-700">Education:</span>
								<div className="mt-1 text-gray-900">
									{participant.education
										? formatDemographicValue("education", participant.education)
										: "N/A"}
								</div>
							</div>
							<div className="border-b pb-2">
								<span className="font-semibold text-gray-700">Occupation:</span>
								<div className="mt-1 text-gray-900">
									{participant.occupation
										? formatDemographicValue("occupation", participant.occupation)
										: "N/A"}
								</div>
							</div>
							<div className="border-b pb-2">
								<span className="font-semibold text-gray-700">Recruitment Experience:</span>
								<div className="mt-1">
									<span
										className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
											participant.recruitment_experience
												? "bg-green-100 text-green-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{participant.recruitment_experience ? "Yes" : "No"}
									</span>
								</div>
							</div>
							{participant.recruitment_role && (
								<div className="border-b pb-2">
									<span className="font-semibold text-gray-700">Recruitment Role:</span>
									<div className="mt-1 text-gray-900">{participant.recruitment_role}</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="card mb-6">
					<h2 className="text-xl font-bold mb-4">Screening & Baseline</h2>
					<div className="space-y-3">
						<div>
							<span className="font-semibold">Screening Text:</span>
							<div className="mt-2 p-3 bg-gray-50 rounded-lg">
								{participant.screening_text || "N/A"}
							</div>
						</div>
						<div>
							<span className="font-semibold">Baseline AI Use:</span>
							<span className="ml-2">{participant.baseline_use ?? "N/A"}</span>
						</div>
					</div>
				</div>

				{participant.attari && Object.keys(participant.attari).length > 0 && (
					<div className="card mb-6">
						<h2 className="text-xl font-bold mb-4">ATTARI Scale Responses</h2>
						<p className="text-sm text-gray-600 mb-4">
							Attitudes Towards AI - Scale: 1 (Strongly Disagree) to 5 (Strongly Agree)
						</p>
						<div className="space-y-4">
							{Object.entries(participant.attari).map(([key, value]) => {
								const question = ATTARI_QUESTIONS_MAP[key];
								return (
									<div key={key} className="border border-gray-200 rounded-lg p-4">
										<div className="flex justify-between items-start mb-2">
											<div className="flex-1">
												<div className="text-xs text-gray-500 mb-1">
													{key}
													{question && (
														<span className="ml-2">
															<span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
																{question.facet}
															</span>
															<span className="ml-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
																{question.valence}
															</span>
														</span>
													)}
												</div>
												<p className="text-sm font-medium text-gray-800">
													{question ? question.text : key}
												</p>
											</div>
											<div className="ml-4 flex-shrink-0">
												<span className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-bold rounded-full">
													{value}
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{participant.tai && Object.keys(participant.tai).length > 0 && (
					<div className="card mb-6">
						<h2 className="text-xl font-bold mb-4">TAI Scale Responses (Threat of AI)</h2>
						<p className="text-sm text-gray-600 mb-4">
							How threatening do you find AI applications that... Scale: 1 (Non-threatening) to 5 (Very threatening)
						</p>
						<div className="space-y-4">
							{Object.entries(participant.tai).map(([key, value]) => {
								const question = TAI_QUESTIONS_MAP[key];
								return (
									<div key={key} className="border border-gray-200 rounded-lg p-4">
										<div className="flex justify-between items-start mb-2">
											<div className="flex-1">
												<div className="text-xs text-gray-500 mb-1">
													{key}
													{question && (
														<span className="ml-2 bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
															{question.category}
														</span>
													)}
												</div>
												<p className="text-sm font-medium text-gray-800">
													{question ? question.text : key}
												</p>
											</div>
											<div className="ml-4 flex-shrink-0">
												<span className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 text-white font-bold rounded-full">
													{value}
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{participant.chat && participant.chat.length > 0 && (
					<div className="card mb-6">
						<h2 className="text-xl font-bold mb-4">Chat History</h2>
						<div className="space-y-4">
							{participant.chat.map((chatEntry, index) => (
								<div key={index} className="border-l-4 border-blue-500 pl-4">
									<div className="text-sm font-semibold text-gray-600 mb-2">
										Round {chatEntry.round}
										{chatEntry.ts && (
											<span className="ml-2 text-gray-400">
												{new Date(chatEntry.ts).toLocaleString()}
											</span>
										)}
									</div>
									<div className="mb-3">
										<div className="text-xs font-semibold text-gray-500 mb-1">User:</div>
										<div className="p-3 bg-blue-50 rounded-lg text-sm">
											{chatEntry.user_message}
										</div>
									</div>
									<div>
										<div className="text-xs font-semibold text-gray-500 mb-1">Assistant:</div>
										<div className="p-3 bg-gray-50 rounded-lg text-sm">
											{chatEntry.reply}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{participant.post_use !== undefined && (
					<div className="card mb-6">
						<h2 className="text-xl font-bold mb-4">Post-Test Responses</h2>
						<div className="space-y-3">
							<div>
								<span className="font-semibold">Post-Test AI Use:</span>
								<span className="ml-2">{participant.post_use}</span>
							</div>
							{participant.post_change && (
								<div>
									<span className="font-semibold">Change Explanation:</span>
									<div className="mt-2 p-3 bg-gray-50 rounded-lg">
										{participant.post_change}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

