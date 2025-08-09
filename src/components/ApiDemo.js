"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useUser } from "@/hooks/useUser";

// Icons
const SendIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const BookOpenIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function ApiDemo() {
    const [requestBody, setRequestBody] = useState(`{
  "githubUrl": "https://github.com/assafelovic/gpt-researcher"
}`);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [responseTime, setResponseTime] = useState(null);
    const { isAuthenticated } = useUser();
    const router = useRouter();

    const handleSendRequest = async () => {
        // Check authentication status first
        if (!isAuthenticated) {
            router.push('/auth/signin');
            return;
        }

        // If authenticated, redirect to playground
        router.push('/playground');
        return;

        // The following code is commented out since we're redirecting instead
        /*
        setIsLoading(true);
        const startTime = Date.now();

        try {
            // Parse the request body to validate JSON
            const parsedBody = JSON.parse(requestBody);

            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock response based on the example
            const mockResponse = {
                success: true,
                message: "API key is valid and repository summarized",
                data: {
                    id: "6bcf558c-832c-4160-9a73-3e21ea149954",
                    name: "test-key",
                    usage: 0,
                    summary: "GPT Researcher is an open deep research agent designed for both web and local research tasks. It provides detailed, factual, and unbiased research reports with citations. The project aims to empower individuals and organizations with accurate information through AI. The architecture involves 'planner' and 'execution' agents to generate research questions, gather information, and aggregate findings into comprehensive reports.",
                    cool_facts: [
                        "Empowers users with accurate and unbiased information through AI",
                        "Utilizes 'planner' and 'execution' agents for research tasks",
                        "Provides detailed research reports with citations",
                        "Supports research on both web and local documents"
                    ]
                }
            };

            const endTime = Date.now();
            setResponseTime(endTime - startTime);
            setResponse(mockResponse);
        } catch (error) {
            const endTime = Date.now();
            setResponseTime(endTime - startTime);
            setResponse({
                success: false,
                error: "Invalid JSON format in request body"
            });
        } finally {
            setIsLoading(false);
        }
        */
    };

    const formatResponseSize = (obj) => {
        return (JSON.stringify(obj).length / 1024).toFixed(1);
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl bg-white">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">API Demo</CardTitle>
                            <CardDescription className="text-gray-600">
                                Test the GitHub repository analysis API with real requests
                            </CardDescription>
                        </div>
                        <Button variant="outline" className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300" asChild>
                            <a href="/documentation">
                                <BookOpenIcon />
                                <span className="ml-2">Documentation</span>
                            </a>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Request Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-mono">POST</Badge>
                            <code className="text-sm sm:text-base font-mono bg-gray-100 px-3 py-1 rounded">
                                https://dandi-kappa-six.vercel.app/api/github-summarizer
                            </code>
                        </div>

                        {/* Request Body */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Body</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">raw</Badge>
                                    <Badge variant="outline" className="text-xs">JSON</Badge>
                                </div>
                            </div>
                            <textarea
                                value={requestBody}
                                onChange={(e) => setRequestBody(e.target.value)}
                                className="w-full h-32 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Enter JSON request body..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleSendRequest}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <SendIcon />
                                        <span className="ml-2">Send</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Response Section */}
                    {response && (
                        <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Badge className={`px-2 py-1 text-xs font-mono ${response.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                            {response.success ? '200 OK' : '400 Bad Request'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <ClockIcon />
                                        <span>{responseTime}ms</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {formatResponseSize(response)} KB
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-700">Body</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">JSON</Badge>
                                </div>
                                <pre className="w-full p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg overflow-x-auto">
                                    <code>{JSON.stringify(response, null, 2)}</code>
                                </pre>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 