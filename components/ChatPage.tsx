"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

interface ChatPageProps {
	participantId: string;
	condition: "control" | "experimental";
	onComplete: () => void;
}

interface ChatMessage {
	round: number;
	user_message: string;
	reply: string;
	ts: string;
}

interface BotMessage {
	round: number;
	reply: string;
	ts: string;
}

export default function ChatPage({ participantId, condition, onComplete }: ChatPageProps) {
	const [currentRound, setCurrentRound] = useState(1);
	const [userMessage, setUserMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFetchingGreeting, setIsFetchingGreeting] = useState(true);
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const [botGreetings, setBotGreetings] = useState<BotMessage[]>([]);
	const [isComplete, setIsComplete] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fetchedRoundsRef = useRef<Set<number>>(new Set());

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [chatHistory, botGreetings]);

	// Fetch initial greeting when round changes or component mounts
	useEffect(() => {
		if (currentRound > 3 || isComplete) {
			setIsFetchingGreeting(false);
			return;
		}

		// Check if we already have greeting for this round
		const hasGreeting = botGreetings.some((g) => g.round === currentRound);
		if (hasGreeting) {
			setIsFetchingGreeting(false);
			return;
		}

		let isMounted = true;

		const fetchGreeting = async () => {
			setIsFetchingGreeting(true);

			try {
				const response = await api.getGreeting({
					participant_id: participantId,
					round: currentRound,
				});

				if (!isMounted) return;

				const greeting: BotMessage = {
					round: currentRound,
					reply: response.reply,
					ts: new Date().toISOString(),
				};

				setBotGreetings((prev) => {
					const exists = prev.some((g) => g.round === greeting.round);
					if (exists) return prev;
					return [...prev, greeting];
				});
			} catch (error) {
				console.error("Error fetching greeting:", error);
				if (isMounted) {
					alert("An error occurred. Please try again.");
				}
			} finally {
				if (isMounted) {
					setIsFetchingGreeting(false);
				}
			}
		};

		fetchGreeting();

		return () => {
			isMounted = false;
		};
	}, [currentRound, participantId, isComplete, botGreetings]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userMessage.trim() || isLoading) return;

		const message = userMessage.trim();

		// OPTIMISTIC UI: Add user message immediately
		const optimisticMessage: ChatMessage = {
			round: currentRound,
			user_message: message,
			reply: "", // Will be updated when API responds
			ts: new Date().toISOString(),
		};

		setChatHistory((prev) => [...prev, optimisticMessage]);
		setUserMessage("");
		setIsLoading(true);

		try {
			const response = await api.chat({
				participant_id: participantId,
				round: currentRound,
				user_message: message,
			});

			// Update the message with the actual reply
			setChatHistory((prev) =>
				prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, reply: response.reply } : msg))
			);

			// Move to next round or complete
			if (currentRound < 3) {
				setCurrentRound((prev) => prev + 1);
			} else {
				setIsComplete(true);
				setTimeout(() => {
					onComplete();
				}, 2000);
			}
		} catch (error) {
			console.error("Error sending message:", error);
			// Remove the optimistic message on error
			setChatHistory((prev) => prev.slice(0, -1));
			setUserMessage(message); // Restore message in input
			alert("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const getConditionDescription = () => {
		return condition === "control"
			? "You will have a general conversation about career topics"
			: "You will discuss AI in recruitment based on your concerns";
	};

	// Remove debug log to prevent console spam

	return (
		<div className='card max-w-4xl mx-auto'>
			<div className='text-center mb-6'>
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>AI Conversation</h1>
				<p className='text-gray-600'>Round {currentRound} of 3</p>
				<div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
					<div
						className='bg-primary-600 h-2 rounded-full transition-all duration-300'
						style={{ width: `${(currentRound / 3) * 100}%` }}></div>
				</div>
			</div>

			<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
				<h3 className='font-semibold text-blue-900 mb-2'>Conversation Context:</h3>
				<p className='text-blue-800 text-sm'>{getConditionDescription()}</p>
			</div>

			{/* Chat Messages */}
			<div className='bg-gray-50 border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto mb-6'>
				{isFetchingGreeting && botGreetings.length === 0 ? (
					<div className='flex items-center justify-center h-full text-gray-500'>
						<div className='text-center'>
							<div className='animate-pulse mb-4'>
								<div className='h-2 w-2 bg-gray-400 rounded-full mx-auto'></div>
							</div>
							<p>AI is starting the conversation...</p>
						</div>
					</div>
				) : botGreetings.length === 0 && chatHistory.length === 0 ? (
					<div className='flex items-center justify-center h-full text-gray-500'>
						<p>No messages yet...</p>
					</div>
				) : (
					<div className='space-y-4'>
						{/* Display messages organized by round with greeting only at round start */}
						{Array.from({ length: Math.max(currentRound, 3) }, (_, roundIdx) => {
							const roundNum = roundIdx + 1;
							const greeting = botGreetings.find((g) => g.round === roundNum);
							const roundMessages = chatHistory.filter((m) => m.round === roundNum);

							// Only show round if it has greeting or messages
							if (!greeting && roundMessages.length === 0) return null;

							return (
								<div key={`round-${roundNum}`} className='space-y-3'>
									{/* Greeting - only show if no messages yet in this round */}
									{greeting && roundMessages.length === 0 && (
										<div className='flex justify-start'>
											<div className='bg-white border border-gray-200 rounded-lg p-3 max-w-xs lg:max-w-md'>
												<p className='text-sm text-gray-800 whitespace-pre-wrap'>{greeting.reply}</p>
											</div>
										</div>
									)}

									{/* Chat messages for this round */}
									{roundMessages.map((message, msgIdx) => (
										<div key={`msg-${roundNum}-${msgIdx}`} className='space-y-3'>
											{/* User Message */}
											<div className='flex justify-end'>
												<div className='bg-primary-600 text-white rounded-lg p-3 max-w-xs lg:max-w-md'>
													<p className='text-sm whitespace-pre-wrap'>{message.user_message}</p>
												</div>
											</div>

											{/* AI Response - Show loading state if no reply yet (optimistic UI) */}
											<div className='flex justify-start'>
												{message.reply ? (
													<div className='bg-white border border-gray-200 rounded-lg p-3 max-w-xs lg:max-w-md'>
														<p className='text-sm text-gray-800 whitespace-pre-wrap'>{message.reply}</p>
													</div>
												) : (
													<div className='bg-white border border-gray-200 rounded-lg p-3'>
														<div className='flex items-center space-x-2'>
															<div className='animate-pulse flex space-x-1'>
																<div className='h-2 w-2 bg-gray-400 rounded-full'></div>
																<div
																	className='h-2 w-2 bg-gray-400 rounded-full'
																	style={{ animationDelay: "0.1s" }}></div>
																<div
																	className='h-2 w-2 bg-gray-400 rounded-full'
																	style={{ animationDelay: "0.2s" }}></div>
															</div>
															<span className='text-sm text-gray-500'>AI is thinking...</span>
														</div>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							);
						})}

						{isFetchingGreeting && (
							<div className='flex justify-start'>
								<div className='bg-white border border-gray-200 rounded-lg p-3'>
									<p className='text-sm text-gray-500'>AI is typing...</p>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Completion Message */}
			{isComplete && (
				<div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
					<div className='flex items-center'>
						<div className='flex-shrink-0'>
							<svg className='h-5 w-5 text-green-400' viewBox='0 0 20 20' fill='currentColor'>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
						<div className='ml-3'>
							<p className='text-sm font-medium text-green-800'>
								Conversation completed! Redirecting to final questions...
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Message Input */}
			{!isComplete && !isFetchingGreeting && (
				<form onSubmit={handleSendMessage} className='flex space-x-4'>
					<input
						type='text'
						value={userMessage}
						onChange={(e) => setUserMessage(e.target.value)}
						placeholder='Type your response here...'
						className='flex-1 form-input'
						disabled={isLoading}
						required
					/>
					<button
						type='submit'
						disabled={isLoading || !userMessage.trim()}
						className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 min-w-[100px] ${
							isLoading || !userMessage.trim()
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95"
						}`}>
						{isLoading ? (
							<span className='flex items-center justify-center'>
								<svg className='animate-spin h-4 w-4 mr-2' viewBox='0 0 24 24'>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
										fill='none'></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
								</svg>
								Sending...
							</span>
						) : (
							"Send"
						)}
					</button>
				</form>
			)}
		</div>
	);
}
