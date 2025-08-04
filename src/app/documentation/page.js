"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

// Icons
const ArrowLeft = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const CodeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const KeyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <CodeIcon />
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-gray-900">API Documentation</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">
                            <ArrowLeft />
                            <span className="ml-2">Back to Home</span>
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-8">
                    {/* Introduction */}
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            GitHub Repository Analysis API
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Analyze any GitHub repository with our AI-powered API. Get comprehensive insights, summaries, and trending data.
                        </p>
                    </div>

                    {/* Authentication */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <KeyIcon />
                                <span>Authentication</span>
                            </CardTitle>
                            <CardDescription>
                                All API requests require authentication using an API key in the request headers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-mono text-gray-700">
                                    Authorization: Bearer YOUR_API_KEY
                                </p>
                            </div>
                            <p className="text-sm text-gray-600">
                                Get your API key by signing up and managing your keys in the dashboard.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Endpoint */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Repository Analysis Endpoint</CardTitle>
                            <CardDescription>
                                Analyze a GitHub repository and get comprehensive insights.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Badge className="bg-green-500 text-white">POST</Badge>
                                <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                                    https://dandi-kappa-six.vercel.app/api/github-summarizer
                                </code>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">Request Body</h4>
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                                    <code className="text-sm font-mono text-gray-700">
                                        {`{
  "githubUrl": "https://github.com/username/repository"
}`}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">Parameters</h4>
                                <div className="space-y-2">
                                    <div className="flex items-start space-x-3">
                                        <Badge variant="outline" className="text-xs">Required</Badge>
                                        <div>
                                            <p className="font-medium text-gray-900">githubUrl</p>
                                            <p className="text-sm text-gray-600">The full URL of the GitHub repository to analyze</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Response */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Response Format</CardTitle>
                            <CardDescription>
                                The API returns detailed analysis in JSON format.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">Success Response (200)</h4>
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
                                    <code className="text-gray-700">
                                        {`{
  "success": true,
  "message": "API key is valid and repository summarized",
  "data": {
    "id": "api-key-id",
    "name": "key-name",
    "usage": 0,
    "summary": "Comprehensive repository summary...",
    "cool_facts": [
      "Interesting fact 1",
      "Interesting fact 2",
      "Interesting fact 3"
    ]
  }
}`}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">Error Response (400/401/500)</h4>
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
                                    <code className="text-gray-700">
                                        {`{
  "success": false,
  "error": "Error message describing the issue"
}`}
                                    </code>
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Example Usage */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Example Usage</CardTitle>
                            <CardDescription>
                                Here&apos;s how to use the API with different programming languages.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* JavaScript/Node.js */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">JavaScript/Node.js</h4>
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
                                    <code className="text-gray-700">
                                        {`const response = await fetch('https://dandi-kappa-six.vercel.app/api/github-summarizer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    githubUrl: 'https://github.com/assafelovic/gpt-researcher'
  })
});

const data = await response.json();
console.log(data);`}
                                    </code>
                                </pre>
                            </div>

                            {/* Python */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">Python</h4>
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
                                    <code className="text-gray-700">
                                        {`import requests

response = requests.post(
    'https://dandi-kappa-six.vercel.app/api/github-summarizer',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    json={
        'githubUrl': 'https://github.com/assafelovic/gpt-researcher'
    }
)

data = response.json()
print(data)`}
                                    </code>
                                </pre>
                            </div>

                            {/* cURL */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">cURL</h4>
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
                                    <code className="text-gray-700">
                                        {`curl -X POST https://dandi-kappa-six.vercel.app/api/github-summarizer \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "githubUrl": "https://github.com/assafelovic/gpt-researcher"
  }'`}
                                    </code>
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rate Limits */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Rate Limits & Pricing</CardTitle>
                            <CardDescription>
                                Understand the limits and costs associated with API usage.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900">Free Tier</h4>
                                    <p className="text-2xl font-bold text-blue-600">5</p>
                                    <p className="text-sm text-blue-700">requests/month</p>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <h4 className="font-semibold text-yellow-900">Pro Tier</h4>
                                    <p className="text-2xl font-bold text-yellow-600">100</p>
                                    <p className="text-sm text-yellow-700">requests/month</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-semibold text-green-900">Enterprise</h4>
                                    <p className="text-2xl font-bold text-green-600">∞</p>
                                    <p className="text-sm text-green-700">unlimited</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <div className="text-center">
                        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700" asChild>
                            <Link href="/">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 