<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
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
        if($method == 'PUT'){
            return [
                //
                'title' => ['required', 'string'],
                'description' => ['required', 'string'],
                'status' => ['required', Rule::in(['Ongoing', 'Deployed', 'Hiring'])],
                'category' => ['required', Rule::in(['AI/ML', 'Web', 'Research', 'IoT'])],
                'team_size' => ['required', 'integer', 'min:1', 'max:25'],
                'team_lead' => ['required', 'string']
            ];
        }else{
            return [
                //
                'title' => ['sometimes','required', 'string'],
                'description' => ['sometimes','required', 'string'],
                'status' => ['sometimes','required', Rule::in(['Ongoing', 'Deployed', 'Hiring'])],
                'category' => ['sometimes','required', Rule::in(['AI/ML', 'Web', 'Research', 'IoT'])],
                'team_size' => ['sometimes','required', 'integer', 'min:1', 'max:25'],
                'team_lead' => ['sometimes','required', 'string']
            ];
        }
    }
}
