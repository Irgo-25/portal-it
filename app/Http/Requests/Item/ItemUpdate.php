<?php

namespace App\Http\Requests\Item;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ItemUpdate extends FormRequest
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
            'code'                     => 'sometimes|string',
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
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'uoms.required' => 'Satuan wajib diisi.',
            'uoms.array' => 'Format satuan tidak valid.',
            'uoms.min' => 'Harus ada minimal satu satuan.',
            'uoms.*.uom_id.required' => 'Satuan wajib dipilih.',
            'uoms.*.uom_id.exists' => 'Satuan yang dipilih tidak valid.',
            'uoms.*.conversion_value.required' => 'Nilai konversi wajib diisi.',
            'uoms.*.conversion_value.numeric' => 'Nilai konversi harus berupa angka.',
            'uoms.*.conversion_value.min' => 'Nilai konversi harus lebih besar dari 0.',
            'uoms.*.is_base.required' => 'Tanda satuan dasar wajib diisi.',
            'uoms.*.is_base.boolean' => 'Tanda satuan dasar harus berupa true atau false.',
        ];
    }
}
