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
            'item_code'                => 'required|string|unique:items,item_code',
            'name'                     => 'required|string|max:255',
            'category_id'              => 'required|exists:categories,id_category',
            'uoms'                     => 'required|array|min:1',
            'uoms.*.uom_id'            => 'required|exists:uoms,id_uom',
            'uoms.*.is_base'           => 'required|boolean',
            'uoms.*.conversion_factor' => 'required|numeric|min:0.0001',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $uoms = $this->input('uoms', []);
            $baseCount = collect($uoms)->where('is_base', true)->count();

            if ($baseCount === 0) {
                $validator->errors()->add('uoms', 'Harus ada satu satuan dasar (base UOM).');
            } elseif ($baseCount > 1) {
                $validator->errors()->add('uoms', 'Hanya boleh ada satu satuan dasar (base UOM).');
            }
        });
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Nama barang wajib diisi.',
            'item_code.required' => 'Kode barang wajib diisi.',
            'item_code.unique' => 'Kode barang sudah digunakan.',
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'uoms.required' => 'Satuan barang wajib diisi.',
            'uoms.min' => 'Setidaknya satu satuan barang harus dipilih.',
            'uoms.*.uom_id.exists' => 'Satuan barang yang dipilih tidak valid.',
            'uoms.*.is_base.required' => 'Status sebagai satuan dasar wajib diisi.',
            'uoms.*.conversion_factor.required' => 'Faktor konversi wajib diisi.',
            'uoms.*.conversion_factor.min' => 'Faktor konversi harus lebih besar dari 0.01.',
        ];
    }
}
