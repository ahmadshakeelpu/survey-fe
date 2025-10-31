"use client";

import { useState } from "react";
import { type DemographicData } from "@/lib/api";

interface DemographicsPageProps {
	demographicData: DemographicData | null;
	setDemographicData: (data: DemographicData) => void;
	onComplete: () => void;
}

const COUNTRIES = [
	"Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh",
	"Belgium", "Brazil", "Canada", "Chile", "China", "Colombia", "Denmark", "Egypt", "Finland",
	"France", "Germany", "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland",
	"Israel", "Italy", "Japan", "Kenya", "Malaysia", "Mexico", "Netherlands", "New Zealand",
	"Nigeria", "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Russia", "Saudi Arabia",
	"Singapore", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand",
	"Turkey", "Ukraine", "United Kingdom", "United States", "Venezuela", "Vietnam", "Other"
];

const OCCUPATIONS = [
	"Accountant", "Administrator", "Architect", "Artist", "Banker", "Business Owner", "Consultant",
	"Data Scientist", "Designer", "Doctor", "Engineer", "Entrepreneur", "Executive", "Financial Analyst",
	"Healthcare Worker", "Human Resources", "IT Professional", "Journalist", "Lawyer", "Manager",
	"Marketing Professional", "Nurse", "Pharmacist", "Pilot", "Professor", "Real Estate Agent",
	"Researcher", "Sales Representative", "Scientist", "Social Worker", "Software Developer",
	"Student", "Teacher", "Technician", "Writer", "Unemployed", "Retired", "Other"
];

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
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.age.trim()) {
			newErrors.age = "Please select your age category";
		}
		if (!formData.gender) {
			newErrors.gender = "Please select your gender";
		}
		if (!formData.nationality.trim()) {
			newErrors.nationality = "Please enter your nationality";
		}
		if (!formData.education.trim()) {
			newErrors.education = "Please select your education level";
		}
		if (!formData.occupation.trim()) {
			newErrors.occupation = "Please enter your occupation";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		setDemographicData(formData);
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
					<label className='form-label'>Age Category <span className='text-red-500'>*</span></label>
					<select
						value={formData.age}
						onChange={(e) => {
							handleChange("age", e.target.value);
							if (errors.age) setErrors({ ...errors, age: "" });
						}}
						className={`form-input ${errors.age ? 'border-red-500 focus:ring-red-500' : ''}`}>
						<option value=''>Please select your age category</option>
						<option value='under-25'>Under 25 years</option>
						<option value='25-34'>25–34 years</option>
						<option value='35-44'>35–44 years</option>
						<option value='45-54'>45–54 years</option>
						<option value='55-64'>55–64 years</option>
						<option value='65-plus'>65 years of age or older</option>
					</select>
					{errors.age && <p className='mt-1 text-sm text-red-600'>{errors.age}</p>}
				</div>

				{/* Gender */}
				<div>
					<label className='form-label'>Gender <span className='text-red-500'>*</span></label>
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
									onChange={(e) => {
										handleChange("gender", e.target.value);
										if (errors.gender) setErrors({ ...errors, gender: "" });
									}}
									className='w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500'
								/>
								<span className='text-gray-700'>{option.label}</span>
							</label>
						))}
					</div>
					{errors.gender && <p className='mt-1 text-sm text-red-600'>{errors.gender}</p>}
				</div>

				{/* Nationality */}
				<div>
					<label className='form-label'>Nationality <span className='text-red-500'>*</span></label>
					<select
						value={formData.nationality}
						onChange={(e) => {
							handleChange("nationality", e.target.value);
							if (errors.nationality) setErrors({ ...errors, nationality: "" });
						}}
						className={`form-input ${errors.nationality ? 'border-red-500 focus:ring-red-500' : ''}`}>
						<option value=''>Select your nationality</option>
						{COUNTRIES.map((country) => (
							<option key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>
								{country}
							</option>
						))}
					</select>
					{errors.nationality && <p className='mt-1 text-sm text-red-600'>{errors.nationality}</p>}
				</div>

				{/* Education */}
				<div>
					<label className='form-label'>Level of Education <span className='text-red-500'>*</span></label>
					<select
						value={formData.education}
						onChange={(e) => {
							handleChange("education", e.target.value);
							if (errors.education) setErrors({ ...errors, education: "" });
						}}
						className={`form-input ${errors.education ? 'border-red-500 focus:ring-red-500' : ''}`}>
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
					{errors.education && <p className='mt-1 text-sm text-red-600'>{errors.education}</p>}
				</div>

				{/* Occupation */}
				<div>
					<label className='form-label'>Current Occupation / Activity <span className='text-red-500'>*</span></label>
					<select
						value={formData.occupation}
						onChange={(e) => {
							handleChange("occupation", e.target.value);
							if (errors.occupation) setErrors({ ...errors, occupation: "" });
						}}
						className={`form-input ${errors.occupation ? 'border-red-500 focus:ring-red-500' : ''}`}>
						<option value=''>Select your occupation</option>
						{OCCUPATIONS.map((occupation) => (
							<option key={occupation} value={occupation.toLowerCase().replace(/\s+/g, '-')}>
								{occupation}
							</option>
						))}
					</select>
					{errors.occupation && <p className='mt-1 text-sm text-red-600'>{errors.occupation}</p>}
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
						className='btn-primary w-full py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'>
						Continue to Questionnaires
					</button>
				</div>
			</form>
		</div>
	);
}
