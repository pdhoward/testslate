import { useState, useEffect } from 'react';
import OpenAI, {
  OpenAIError,
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  BadRequestError,
  AuthenticationError,
  InternalServerError,
  PermissionDeniedError,
  UnprocessableEntityError,
} from 'openai';

interface MinimaxAIOptions {
  baseURL?: string;
  orgId?: string;
  apiKey?: string;
  timeout?: number;
}

interface ChatMessage {
  senderType: 'USER' | 'BOT';
  senderName?: string;
  text: string;
}

interface ChatCompletionParams {
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

const useMinimaxAI = (options: MinimaxAIOptions) => {
  const [apiKey, setApiKey] = useState<string>(options.apiKey || '');
  const [orgId, setOrgId] = useState<string>(options.orgId || '');
  const [baseURL] = useState<string>(options.baseURL || 'https://api.minimax.chat/v1');
  const [timeout] = useState<number>(options.timeout || 30000);

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  const handleErrors = (error: OpenAIError) => {
    if (error instanceof APIConnectionError) {
      console.error('API Connection Error', error);
    } else if (error instanceof APIConnectionTimeoutError) {
      console.error('API Timeout Error', error);
    } else if (error instanceof APIUserAbortError) {
      console.error('API User Abort Error', error);
    } else if (error instanceof NotFoundError) {
      console.error('Resource Not Found', error);
    } else if (error instanceof ConflictError) {
      console.error('Resource Conflict Error', error);
    } else if (error instanceof RateLimitError) {
      console.error('Rate Limit Exceeded', error);
    } else if (error instanceof BadRequestError) {
      console.error('Bad Request', error);
    } else if (error instanceof AuthenticationError) {
      console.error('Authentication Error', error);
    } else if (error instanceof InternalServerError) {
      console.error('Internal Server Error', error);
    } else if (error instanceof PermissionDeniedError) {
      console.error('Permission Denied', error);
    } else if (error instanceof UnprocessableEntityError) {
      console.error('Unprocessable Entity', error);
    } else {
      console.error('Unknown error', error);
    }
  };

  const createChatCompletion = async (params: ChatCompletionParams) => {
    try {
      const response = await fetch(`${baseURL}/text/chatcompletion`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: params.model,
          messages: params.messages,
          max_tokens: params.maxTokens,
          temperature: params.temperature,
        }),
        timeout,
      });
      if (!response.ok) {
        throw new APIError(`Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      handleErrors(error as OpenAIError);
      throw error;
    }
  };

  return { createChatCompletion, setApiKey, setOrgId };
};

const Sidebar = () => {
  const { createChatCompletion } = useMinimaxAI({
    apiKey: 'your-api-key',
    orgId: 'your-org-id',
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [model, setModel] = useState<string>('abab5-chat');

  const handleSubmit = async () => {
    try {
      const response = await createChatCompletion({
        model,
        messages,
        maxTokens: 100,
        temperature: 0.7,
      });
      console.log('Chat Completion Response:', response);
    } catch (error) {
      console.error('Error submitting chat:', error);
    }
  };

  return (
    <div className="sidebar">
      <h2>AI Document Options</h2>
      <label>
        Model:
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="abab5-chat">abab5-chat</option>
          <option value="abab5.5-chat">abab5.5-chat</option>
          <option value="abab5.5-chat-pro">abab5.5-chat-pro</option>
        </select>
      </label>
      {/* Add more configuration options here */}
      <button onClick={handleSubmit}>Submit for Analysis</button>
    </div>
  );
};

export default Sidebar;
