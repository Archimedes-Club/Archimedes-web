<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
        $method = $this->method();
        if ($method == 'PUT'){
            return [
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'phone' => ['nullable', 'string', 'regex:/^\d{10}$/'],
                'linkedin_url' => ['nullable', 'url'],
            ];
        }else{
            return [
                'email' => ['sometimes','required', 'email', 'max:255', 'unique:users,email'],
                'phone' => ['nullable', 'string', 'regex:/^\d{10}$/'],
                'linkedin_url' => ['nullable', 'url'],
            ];
        }
    }
}
