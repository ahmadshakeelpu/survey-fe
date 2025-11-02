"use client";

import { useState, useEffect } from "react";
import { api, type Participant } from "@/lib/api";
import { useRouter } from "next/navigation";
import { formatDemographicValue } from "@/lib/demographicLabels";

export default function AdminDashboard() {
	const [password, setPassword] = useState("");
	const [token, setToken] = useState<string | null>(null);
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [stats, setStats] = useState<{
		total: number;
		completed: number;
		control: number;
		experimental: number;
		excluded: number;
	} | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCondition, setFilterCondition] = useState<"all" | "control" | "experimental">("all");
	const [filterCompleted, setFilterCompleted] = useState<"all" | "completed" | "incomplete">("all");
	const router = useRouter();

	useEffect(() => {
		const savedToken = localStorage.getItem("admin-token");
		if (savedToken) {
			setToken(savedToken);
			loadData(savedToken);
		}
	}, []);

	const loadData = async (adminToken: string) => {
		setLoading(true);
		try {
			const [participantsData, statsData] = await Promise.all([
				api.admin.getParticipants(adminToken),
				api.admin.getStats(adminToken),
			]);
			setParticipants(participantsData.participants || []);
			setStats(statsData.stats);
			setError("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load data");
			if (err instanceof Error && err.message.includes("unauthorized")) {
				localStorage.removeItem("admin-token");
				setToken(null);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const result = await api.admin.login(password);
			if (result.success) {
				setToken(result.token);
				localStorage.setItem("admin-token", result.token);
				await loadData(result.token);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("admin-token");
		setToken(null);
		setParticipants([]);
		setStats(null);
		setPassword("");
	};

	const handleExport = async () => {
		if (!token) return;

		try {
			const blob = await api.admin.exportData(token);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `participants_${new Date().toISOString().split("T")[0]}.csv`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Export failed");
		}
	};

	const handleViewParticipant = (id: string) => {
		router.push(`/admin/${id}`);
	};

	const filteredParticipants = participants
		.filter((p) => {
			if (searchTerm) {
				const search = searchTerm.toLowerCase();
				return (
					p.id.toLowerCase().includes(search) ||
					p.gender?.toLowerCase().includes(search) ||
					p.nationality?.toLowerCase().includes(search) ||
					p.occupation?.toLowerCase().includes(search)
				);
			}
			return true;
		})
		.filter((p) => {
			if (filterCondition === "all") return true;
			return p.condition === filterCondition;
		})
		.filter((p) => {
			if (filterCompleted === "all") return true;
			if (filterCompleted === "completed") return p.completed === true;
			return !p.completed;
		});

	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="card max-w-md w-full">
					<h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
					<form onSubmit={handleLogin} className="space-y-4">
						<div>
							<label htmlFor="password" className="block text-sm font-medium mb-2">
								Admin Password
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="input-field"
								placeholder="Enter admin password"
								required
							/>
						</div>
						{error && <div className="text-red-600 text-sm">{error}</div>}
						<button type="submit" className="btn-primary w-full" disabled={loading}>
							{loading ? "Logging in..." : "Login"}
						</button>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<div className="flex gap-3">
						<button onClick={handleExport} className="btn-secondary">
							Export CSV
						</button>
						<button onClick={handleLogout} className="btn-secondary">
							Logout
						</button>
					</div>
				</div>

				{stats && (
					<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
						<div className="card">
							<div className="text-sm text-gray-600 mb-1">Total Participants</div>
							<div className="text-2xl font-bold">{stats.total}</div>
						</div>
						<div className="card">
							<div className="text-sm text-gray-600 mb-1">Completed</div>
							<div className="text-2xl font-bold text-green-600">{stats.completed}</div>
						</div>
						<div className="card">
							<div className="text-sm text-gray-600 mb-1">Control Group</div>
							<div className="text-2xl font-bold text-blue-600">{stats.control}</div>
						</div>
						<div className="card">
							<div className="text-sm text-gray-600 mb-1">Experimental Group</div>
							<div className="text-2xl font-bold text-purple-600">{stats.experimental}</div>
						</div>
						<div className="card">
							<div className="text-sm text-gray-600 mb-1">Excluded</div>
							<div className="text-2xl font-bold text-red-600">{stats.excluded}</div>
						</div>
					</div>
				)}

				<div className="card mb-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label htmlFor="search" className="block text-sm font-medium mb-2">
								Search
							</label>
							<input
								type="text"
								id="search"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="input-field"
								placeholder="Search by ID, gender, nationality..."
							/>
						</div>
						<div>
							<label htmlFor="condition" className="block text-sm font-medium mb-2">
								Condition
							</label>
							<select
								id="condition"
								value={filterCondition}
								onChange={(e) => setFilterCondition(e.target.value as typeof filterCondition)}
								className="input-field"
							>
								<option value="all">All Conditions</option>
								<option value="control">Control</option>
								<option value="experimental">Experimental</option>
							</select>
						</div>
						<div>
							<label htmlFor="completed" className="block text-sm font-medium mb-2">
								Status
							</label>
							<select
								id="completed"
								value={filterCompleted}
								onChange={(e) => setFilterCompleted(e.target.value as typeof filterCompleted)}
								className="input-field"
							>
								<option value="all">All Status</option>
								<option value="completed">Completed</option>
								<option value="incomplete">Incomplete</option>
							</select>
						</div>
					</div>
				</div>

				{loading ? (
					<div className="card flex items-center justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					</div>
				) : (
					<div className="card">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Consent Date
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Demographics
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Condition
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredParticipants.length === 0 ? (
										<tr>
											<td colSpan={6} className="px-4 py-8 text-center text-gray-500">
												No participants found
											</td>
										</tr>
									) : (
										filteredParticipants.map((participant) => (
											<tr key={participant.id} className="hover:bg-gray-50">
												<td className="px-4 py-3 text-sm font-mono">{participant.id.slice(0, 8)}...</td>
												<td className="px-4 py-3 text-sm">
													{participant.consent_at
														? new Date(participant.consent_at).toLocaleDateString()
														: "N/A"}
												</td>
												<td className="px-4 py-3 text-sm">
													<div className="text-xs space-y-1">
														{participant.age_category && (
															<div className="truncate">
																<span className="font-medium text-gray-600">Age:</span>{" "}
																{formatDemographicValue("age_category", participant.age_category)}
															</div>
														)}
														{participant.gender && (
															<div className="truncate">
																<span className="font-medium text-gray-600">Gender:</span>{" "}
																{formatDemographicValue("gender", participant.gender)}
															</div>
														)}
														{participant.nationality && (
															<div className="truncate">
																<span className="font-medium text-gray-600">Nationality:</span>{" "}
																{formatDemographicValue("nationality", participant.nationality)}
															</div>
														)}
														{!participant.age_category &&
															!participant.gender &&
															!participant.nationality && (
																<span className="text-gray-400">No data</span>
															)}
													</div>
												</td>
												<td className="px-4 py-3 text-sm">
													{participant.condition ? (
														<span
															className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
																participant.condition === "control"
																	? "bg-blue-100 text-blue-800"
																	: "bg-purple-100 text-purple-800"
															}`}
														>
															{participant.condition}
														</span>
													) : (
														<span className="text-gray-400">Not assigned</span>
													)}
												</td>
												<td className="px-4 py-3 text-sm">
													<span
														className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
															participant.completed
																? "bg-green-100 text-green-800"
																: "bg-yellow-100 text-yellow-800"
														}`}
													>
														{participant.completed ? "Completed" : "In Progress"}
													</span>
												</td>
												<td className="px-4 py-3 text-sm">
													<button
														onClick={() => handleViewParticipant(participant.id)}
														className="text-blue-600 hover:text-blue-800 font-medium"
													>
														View Details
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
						<div className="mt-4 text-sm text-gray-600">
							Showing {filteredParticipants.length} of {participants.length} participants
						</div>
					</div>
				)}

				{error && (
					<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
				)}
			</div>
		</div>
	);
}

