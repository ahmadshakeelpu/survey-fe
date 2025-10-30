"use client";

import { useState } from "react";
import { type DemographicData } from "@/lib/api";

interface ConsentPageProps {
	onStart: () => void;
	demographicData: DemographicData | null;
	setDemographicData: (data: DemographicData) => void;
}

export default function ConsentPage({ onStart, demographicData, setDemographicData }: ConsentPageProps) {
	const [consentGiven, setConsentGiven] = useState(false);

	const handleStart = () => {
		if (consentGiven) {
			onStart();
		}
	};

	return (
		<div className='card max-w-3xl mx-auto'>
			<div className='text-center mb-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>Psychological Study: AI in Recruitment</h1>
				<div className='w-16 h-1 bg-primary-600 mx-auto rounded'></div>
			</div>

			<div className='prose max-w-none mb-8'>
				<p className='text-lg text-gray-700 mb-6'>
					As part of a psychological study, we want to find out how people react to different conversation situations.
					In the course of the study, you will interact with a computer-assisted interlocutor and then answer a few
					short questions.
				</p>

				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
					<h3 className='font-semibold text-blue-900 mb-2'>Study Information:</h3>
					<ul className='text-blue-800 space-y-1'>
						<li>• Participation takes about 10-15 minutes</li>
						<li>• There are no right or wrong answers – all that matters is your personal assessment</li>
						<li>• All information is treated anonymously and confidentially</li>
						<li>• You can cancel your participation at any time without giving reasons</li>
					</ul>
				</div>

				<div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6'>
					<h3 className='font-semibold text-gray-900 mb-2'>Consent:</h3>
					<p className='text-gray-700'>
						By clicking on "Start", you agree that the data collected in the context of this study may be stored
						anonymously and used for scientific evaluations.
					</p>
				</div>
			</div>

			<div className='flex items-center justify-center mb-6'>
				<label className='flex items-center space-x-3 cursor-pointer'>
					<input
						type='checkbox'
						checked={consentGiven}
						onChange={(e) => setConsentGiven(e.target.checked)}
						className='w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
					/>
					<span className='text-gray-700 font-medium'>I agree to participate in this study</span>
				</label>
			</div>

			<div className='text-center'>
				<button
					onClick={handleStart}
					disabled={!consentGiven}
					className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200 ${
						consentGiven ? "btn-primary" : "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}>
					Start Study
				</button>
			</div>
		</div>
	);
}
