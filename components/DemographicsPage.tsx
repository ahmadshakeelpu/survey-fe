"use client";

import { useState } from "react";
import { type DemographicData } from "@/lib/api";

interface DemographicsPageProps {
	demographicData: DemographicData | null;
	setDemographicData: (data: DemographicData) => void;
	onComplete: () => void;
}

export default function DemographicsPage({ demographicData, setDemographicData, onComplete }: DemographicsPageProps) {
	const [formData, setFormData] = useState<DemographicData>({
		age: demographicData?.age || "",
		gender: demographicData?.gender || "",
		nationality: demographicData?.nationality || "",
		education: demographicData?.education || "",
		occupation: demographicData?.occupation || "",
		recruitment_experience: demographicData?.recruitment_experience || false,
		recruitment_role: demographicData?.recruitment_role || "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setDemographicData(formData);
		// Add small delay to ensure state updates
		await new Promise((resolve) => setTimeout(resolve, 100));
		onComplete();
	};

	const handleChange = (field: keyof DemographicData, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className='card max-w-2xl mx-auto'>
			<div className='text-center mb-8'>
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>Demographic Information</h1>
				<p className='text-gray-600'>Please provide some basic information about yourself</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Age */}
				<div>
					<label className='form-label'>Age Category</label>
					<select
						value={formData.age}
						onChange={(e) => handleChange("age", e.target.value)}
						className='form-input'
						required>
						<option value=''>Please select your age category</option>
						<option value='under-25'>Under 25 years</option>
						<option value='25-34'>25–34 years</option>
						<option value='35-44'>35–44 years</option>
						<option value='45-54'>45–54 years</option>
						<option value='55-64'>55–64 years</option>
						<option value='65-plus'>65 years of age or older</option>
					</select>
				</div>

				{/* Gender */}
				<div>
					<label className='form-label'>Gender</label>
					<div className='space-y-2'>
						{[
							{ value: "female", label: "Female" },
							{ value: "male", label: "Male" },
							{ value: "miscellaneous", label: "Miscellaneous" },
							{ value: "prefer-not-to-say", label: "I don't want to show off" },
						].map((option) => (
							<label key={option.value} className='flex items-center space-x-2 cursor-pointer'>
								<input
									type='radio'
									name='gender'
									value={option.value}
									checked={formData.gender === option.value}
									onChange={(e) => handleChange("gender", e.target.value)}
									className='w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500'
								/>
								<span className='text-gray-700'>{option.label}</span>
							</label>
						))}
					</div>
				</div>

				{/* Nationality */}
				<div>
					<label className='form-label'>Nationality</label>
					<input
						type='text'
						value={formData.nationality}
						onChange={(e) => handleChange("nationality", e.target.value)}
						className='form-input'
						placeholder='Enter your nationality'
						required
					/>
				</div>

				{/* Education */}
				<div>
					<label className='form-label'>Level of Education</label>
					<select
						value={formData.education}
						onChange={(e) => handleChange("education", e.target.value)}
						className='form-input'
						required>
						<option value=''>What is your highest completed educational qualification?</option>
						<option value='secondary-1'>Secondary level I (e.g. Realschule, Sekundarschule)</option>
						<option value='secondary-2'>
							Secondary level II (e.g. grammar school, vocational baccalaureate, Matura)
						</option>
						<option value='vocational'>Vocational training / apprenticeship</option>
						<option value='bachelor'>Bachelor</option>
						<option value='master'>Masters degree</option>
						<option value='doctorate'>Doctorate / Doctorate</option>
						<option value='other'>Other degree</option>
					</select>
				</div>

				{/* Occupation */}
				<div>
					<label className='form-label'>Current Occupation / Activity</label>
					<input
						type='text'
						value={formData.occupation}
						onChange={(e) => handleChange("occupation", e.target.value)}
						className='form-input'
						placeholder='Enter your current occupation or activity'
						required
					/>
				</div>

				{/* Recruitment Experience */}
				<div>
					<label className='form-label'>Recruitment Experience</label>
					<p className='text-sm text-gray-600 mb-3'>
						Do you already have experience in personnel selection or recruiting?
					</p>
					<div className='space-y-2'>
						<label className='flex items-center space-x-2 cursor-pointer'>
							<input
								type='radio'
								name='recruitment_experience'
								value='yes'
								checked={formData.recruitment_experience === true}
								onChange={() => handleChange("recruitment_experience", true)}
								className='w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500'
							/>
							<span className='text-gray-700'>Yes</span>
						</label>
						<label className='flex items-center space-x-2 cursor-pointer'>
							<input
								type='radio'
								name='recruitment_experience'
								value='no'
								checked={formData.recruitment_experience === false}
								onChange={() => handleChange("recruitment_experience", false)}
								className='w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500'
							/>
							<span className='text-gray-700'>No</span>
						</label>
					</div>
				</div>

				{/* Recruitment Role */}
				{formData.recruitment_experience && (
					<div>
						<label className='form-label'>Recruitment Role</label>
						<p className='text-sm text-gray-600 mb-2'>What role or function did you have/have in this?</p>
						<input
							type='text'
							value={formData.recruitment_role}
							onChange={(e) => handleChange("recruitment_role", e.target.value)}
							className='form-input'
							placeholder='Describe your role in recruitment'
						/>
					</div>
				)}

				<div className='pt-6'>
					<button
						type='submit'
						disabled={isLoading}
						className={`btn-primary w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
						{isLoading ? "Saving..." : "Continue to Questionnaires"}
					</button>
				</div>
			</form>
		</div>
	);
}
