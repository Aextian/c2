<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OpenAIController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $taskTitle = $request->input('title');
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant. Keep responses concise.'],
                ['role' => 'user', 'content' => "Break down the task \"{$taskTitle}\" into exactly 4 short sub-tasks."],
            ],
            'max_tokens' => 100,
        ]);
        return response()->json($response->json());
    }
}
