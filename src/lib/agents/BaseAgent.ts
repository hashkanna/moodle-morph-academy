// Base Agent class for all specialized AI agents
export abstract class BaseAgent {
  protected claudeKey: string;
  protected agentName: string;
  protected agentPersonality: string;

  constructor(agentName: string, personality: string) {
    this.claudeKey = import.meta.env.VITE_CLAUDE_API_KEY;
    this.agentName = agentName;
    this.agentPersonality = personality;
    
    if (!this.claudeKey) {
      console.warn(`${agentName}: Claude API key not found. Some features may not work.`);
    }
  }

  protected async callClaude(prompt: string, maxTokens: number = 2000): Promise<string> {
    if (!this.claudeKey) {
      throw new Error(`${this.agentName}: Claude API key not configured`);
    }

    const systemPrompt = `You are ${this.agentName}, a specialized AI agent. ${this.agentPersonality}

IMPORTANT: Always respond with valid JSON only. No explanations, no markdown, just pure JSON.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: maxTokens,
          temperature: 0.7,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error(`${this.agentName} API Error:`, error);
      throw error;
    }
  }

  protected parseJSONResponse<T>(jsonString: string): T {
    try {
      // Clean up the response to extract JSON
      const cleaned = jsonString.replace(/^```json\s*|\s*```$/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error(`${this.agentName}: Failed to parse JSON response`, error);
      throw new Error(`${this.agentName}: Invalid JSON response from AI`);
    }
  }

  abstract getName(): string;
  abstract getDescription(): string;
}