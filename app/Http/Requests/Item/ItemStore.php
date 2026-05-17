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
            'category_id' => ['required', 'exists:categories,id_category'],
            'departement_id' => ['required', 'exists:departements,id_departement'],
            'uoms'=> ['required', 'array', 'min:1'],
            'uoms.*.uom_id' => ['required', 'exists:uoms,id_uom', 'distinct'],
            'uoms.*.is_base' => ['required', 'boolean'],
            'uoms.*.conversion_factor' => ['required', 'numeric', 'min:0.01'],
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
            'uoms.required' => 'Satuan barang wajib diisi.',
            'uoms.min' => 'Setidaknya satu satuan barang harus dipilih.',
            'uoms.*.uom_id.exists' => 'Satuan barang yang dipilih tidak valid.',
            'uoms.*.is_base.required' => 'Status sebagai satuan dasar wajib diisi.',
            'uoms.*.conversion_factor.required' => 'Faktor konversi wajib diisi.',
            'uoms.*.conversion_factor.min' => 'Faktor konversi harus lebih besar dari 0.01.',
        ];
    }
}
