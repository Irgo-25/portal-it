<?php

namespace App\Http\Requests\Departement;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartement extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:20'],
            'code' => ['sometimes', 'string',Rule::unique('departements', 'code')
                ->ignore($this->route('departement')), 'min:2', 'max:3'],
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
            'code.unique' => 'Kode sudah digunakan.',
        ];
    }
}
