<?php

namespace App\Http\Requests\Item;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ItemStore extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255', 'unique:items'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id_category'],
            'departement_id' => ['required', 'exists:departements,id_departement'],
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Nama barang wajib diisi.',
            'code.required' => 'Kode barang wajib diisi.',
            'code.unique' => 'Kode barang sudah digunakan.',
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'departement_id.required' => 'Departemen wajib dipilih.',
            'departement_id.exists' => 'Departemen yang dipilih tidak valid.',
        ];
    }
}
