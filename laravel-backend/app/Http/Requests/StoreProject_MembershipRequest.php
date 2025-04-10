<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProject_MembershipRequest extends FormRequest
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
            'user_id' => ['nullable', 'exists:users,id'],
            'project_id' => ['required', 'exists:projects,id' ],
            'role' => ['required', Rule::in(['member', 'admin', 'lead'])],
            'status' => ['required', Rule::in(['active', 'pending'])],
            'user_email' => ['required', 'email']
        ];
    }
}
