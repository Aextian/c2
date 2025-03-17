<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required'],
            'type' => ['required'],
            'options' => ['array'],
            'deadLine' => ['required', 'date', 'after:' . now()->addHour()],

        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'The title field is required.',
            'content.required' => 'The content field is required.',
            'type.required' => 'The type field is required.',
            'deadLine.required' => 'The deadLine field is required.',
            'deadLine.after' => 'The deadline must be at least 1 hour after the current time.',

        ];
    }
}
