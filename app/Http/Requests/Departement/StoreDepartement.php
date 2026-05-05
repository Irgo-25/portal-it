<?php

namespace App\Http\Requests\Departement;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDepartement extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:20'],
            'code' => ['required', 'string', 'max:3', 'min:2'],
        ];
    }
    public function messages()
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa string.',
            'name.max' => 'Nama tidak boleh lebih dari 20 karakter.',
            'code.required' => 'Kode wajib diisi.',
            'code.string' => 'Kode harus berupa string.',
            'code.max' => 'Kode tidak boleh lebih dari 3 karakter.',
            'code.min' => 'Kode tidak boleh kurang dari 2 karakter.',
        ];
    }
}
