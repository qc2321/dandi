import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Define schema for structured output
const repoSummarySchema = z.object({
    summary: z.string().describe("A concise summary of the GitHub repository"),
    cool_facts: z.array(z.string()).describe("List of interesting facts or notable features from the repository")
});

// Create prompt template
const prompt = ChatPromptTemplate.fromTemplate(
    "Summarize the github repository from this README file content:\n\n{readme_content}"
);

// Create LLM with structured output
const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0
});

const structuredLLM = llm.withStructuredOutput(repoSummarySchema, {
    name: "repository_summary" // Providing schema name for better context
});

// Create chain
const chain = prompt.pipe(structuredLLM);

export async function summarizeReadme(readmeContent) {
    try {
        const result = await chain.invoke({
            readme_content: readmeContent
        });
        return result;
    } catch (error) {
        console.error("Error summarizing README:", error);
        throw new Error("Failed to summarize repository README");
    }
} 