<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
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
            //
            'title' => ['required', 'string'],
            'description' => ['required', 'string'],
            'status' => ['required', Rule::in(['Ongoing', 'Deployed', 'Hiring'])],
            'category' => ['required', Rule::in(['AI/ML', 'Web', 'Research', 'IoT'])],
            'is_public' => ['sometimes', 'boolean'],
            'team_size' => ['required', 'integer', 'min:1', 'max:25'],
        ];
    }
}