<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
        $userId = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255', 'unique:users,name,' . $userId],
            'email' => ['required', 'email', 'unique:users,email,' . $userId],
            // 'password' => [$this->route('user') ? 'nullable' : 'required', 'string', 'confirmed'],
            'password' => [
                $this->route('user') ? 'nullable' : 'required',
                'string',
                'confirmed',
                // 'regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%]).*$/',
                // alpha numeric
                'regex:/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/',
                'max:20', // Set a maximum length (change 20 to your desired limit)
                'min:8', // Set a minimum length (change 8 to your desired limit)
            ],
            'roles' => 'required',

        ];
    }

    public function messages()
    {
        return [
            'password.regex' => 'The password must only contain letters and numbers.',
        ];
    }
}
