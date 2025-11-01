"use client";

import { useState, useEffect } from "react";
import { type TaiData } from "@/lib/api";

interface TaiQuestionnaireProps {
	taiData: TaiData | null;
	setTaiData: (data: TaiData) => void;
	onComplete: (data: TaiData) => Promise<void>;
}

const TAI_QUESTIONS = {
	recognition: [
		{ id: "RCG1", text: "Detect suitability of applicants." },
		{ id: "RCG2", text: "Record suitability of applicants." },
		{ id: "RCG3", text: "Identify suitability of applicants." },
	],
	prediction: [
		{ id: "PDC1", text: "Forecast the development of suitability of applicants." },
		{ id: "PDC2", text: "Predict the development of suitability of applicants." },
		{ id: "PDC3", text: "Calculate the development of suitability of applicants." },
	],
	recommendation: [
		{ id: "RCM1", text: "Recommend hiring of applicants." },
		{ id: "RCM2", text: "Propose hiring of applicants." },
		{ id: "RCM3", text: "Suggest hiring of applicants." },
	],
	decision_making: [
		{ id: "DSM1", text: "Decide on hiring of applicants." },
		{ id: "DSM2", text: "Define hiring of applicants." },
		{ id: "DSM3", text: "Preset hiring of applicants." },
	],
};

export default function TaiQuestionnaire({ taiData, setTaiData, onComplete }: TaiQuestionnaireProps) {
	const [responses, setResponses] = useState<TaiData>(taiData || {});
	const [selectedQuestions, setSelectedQuestions] = useState<Array<{ id: string; text: string; category: string }>>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Randomly select one question from each category
	useEffect(() => {
		const categories = Object.keys(TAI_QUESTIONS) as Array<keyof typeof TAI_QUESTIONS>;
		const selected = categories.map((category) => {
			const questions = TAI_QUESTIONS[category];
			const randomIndex = Math.floor(Math.random() * questions.length);
			return {
				...questions[randomIndex],
				category: category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
			};
		});
		setSelectedQuestions(selected);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;
		
		setIsSubmitting(true);
		setTaiData(responses);
		
		try {
			await onComplete(responses);
		} catch (error) {
			setIsSubmitting(false);
		}
	};

	const handleResponseChange = (questionId: string, value: number) => {
		setResponses((prev) => ({ ...prev, [questionId]: value }));
	};

	const isComplete = selectedQuestions.every((q) => responses[q.id] !== undefined);

	return (
		<div className='card max-w-3xl mx-auto'>
			<div className='text-center mb-8'>
				<h1 className='text-2xl font-bold text-gray-900'>Please rate how threatening you find these AI applications</h1>
			</div>

			<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
				<h3 className='font-semibold text-blue-900 mb-2'>Instructions:</h3>
				<p className='text-blue-800 text-sm'>
					If you now think of the use of AI in human resource management, how threatening do you think computer
					applications of artificial intelligence are that...
				</p>
				<p className='text-blue-800 text-sm mt-2'>
					Please rate each statement on a scale from 1 (non-threatening) to 5 (very threatening).
				</p>
			</div>

		<form onSubmit={handleSubmit} className='space-y-6'>
			{selectedQuestions.map((question, index) => (
				<div key={question.id} className='border border-gray-200 rounded-lg p-4'>
					<div className='flex justify-between items-start mb-3'>
						<span className='text-sm font-medium text-gray-500'>Question {index + 1}</span>
					</div>

					<p className='text-gray-800 mb-4 font-medium'>{question.text}</p>

					<div className='flex justify-between items-center'>
						<span className='text-sm text-gray-600'>Non-threatening</span>
						<div className='flex space-x-4'>
							{[1, 2, 3, 4, 5].map((value) => (
								<label key={value} className='flex flex-col items-center cursor-pointer'>
									<input
										type='radio'
										name={question.id}
										value={value}
										checked={responses[question.id] === value}
										onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
										className='w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500'
									/>
									<span className='text-sm text-gray-700 mt-1'>{value}</span>
								</label>
							))}
						</div>
						<span className='text-sm text-gray-600'>Very threatening</span>
					</div>
				</div>
			))}

			<div className='pt-6'>
				<button
					type='submit'
					disabled={!isComplete || isSubmitting}
					className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
						isComplete && !isSubmitting ? "btn-primary" : "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}>
					{isSubmitting ? "Processing..." : "Continue"}
				</button>
			</div>
		</form>
		</div>
	);
}
