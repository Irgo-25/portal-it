<?php

namespace App\Http\Requests\UOM;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUom extends FormRequest
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
            'symbol' => ['required', 'string', 'max:10'],
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Unit Of Measure wajib diisi.',
            'name.string' => 'Unit Of Measure harus berupa kata',
            'name.max' => 'Unit Of Measure tidak boleh lebih dari 20 karakter.',
            'symbol.required' => 'Symbol wajib diisi.',
            'symbol.string' => 'Symbol harus berupa kata',
            'symbol.max' => 'Symbol tidak boleh lebih dari 10 karakter.',
        ];
    }
}
