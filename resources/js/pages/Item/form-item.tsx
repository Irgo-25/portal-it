import { useForm, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldGroup,
    FieldSet,
    FieldLegend,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category, Departement, Uom, ItemUom } from '@/types';

interface ItemFormData {
    code: string;
    name: string;
    category_id: string;
    departement_id: string;
    uoms: ItemUom[];
}

interface ItemFormProps {
    mode: 'create' | 'edit';
    initialData: ItemFormData;
    itemId?: number;
    categories: Category[];
    departements: Departement[];
    uoms: Uom[];
}

export default function ItemForm({
    mode,
    initialData,
    itemId,
    categories,
    departements,
    uoms,
}: ItemFormProps) {
    const { data, setData, post, put, errors, processing } =
        useForm<ItemFormData>(initialData);
    const isEditMode = mode === 'edit';

    const submit = () => {
        if (isEditMode) {
            put(route('items.update', itemId));
        } else {
            post(route('items.store'));
        }
    };
    const addUom = () => {
        setData('uoms', [
            ...data.uoms,
            { uom_id: '', is_base: false, conversion_factor: 1 },
        ]);
    };
    const setAsBase = (index: number) => {
        setData(
            'uoms',
            data.uoms.map((u, i) => ({
                ...u,
                is_base: i === index,
                conversion_factor: i === index ? 1 : u.conversion_factor,
            })),
        );
    };

    const usedUomIds = data.uoms.map((u) => u.uom_id).filter(Boolean);

    const updateUom = (
        index: number,
        field: keyof ItemUom,
        value: string | boolean | number,
    ) => {
        const updatedUoms = [...data.uoms];
        updatedUoms[index] = { ...updatedUoms[index], [field]: value };
        setData('uoms', updatedUoms);
    };
    const removeUom = (index: number) => {
        const updatedUoms = [...data.uoms];
        updatedUoms.splice(index, 1);
        setData('uoms', updatedUoms);
    };

    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>
                    {isEditMode ? 'Edit Item' : 'Create Item'}
                </FieldLegend>
                <FieldDescription>
                    {isEditMode
                        ? 'Update the details of your item below.'
                        : 'Fill in the details of your new item below.'}
                </FieldDescription>
                <FieldGroup className="grid grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="code">Item Code</FieldLabel>
                        <Input
                            id="code"
                            disabled
                            value={data.code || 'AUTO-GENERATED'}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="name">Item Name</FieldLabel>
                        <Input
                            id="name"
                            placeholder="Evil Rabbit"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            onError={
                                errors.name
                                    ? () => (
                                          <p className="text-sm text-red-500">
                                              {errors.name}
                                          </p>
                                      )
                                    : undefined
                            }
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="category_id">Category</FieldLabel>
                        <Select
                            value={data.category_id}
                            onValueChange={(value) =>
                                setData('category_id', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectGroup key={category.id_category}>
                                        <SelectItem
                                            value={String(category.id_category)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && (
                            <p className="text-sm text-red-500">
                                {errors.category_id}
                            </p>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="departement_id">
                            Departement
                        </FieldLabel>
                        <Select
                            value={data.departement_id}
                            onValueChange={(value) =>
                                setData('departement_id', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a departement" />
                            </SelectTrigger>
                            <SelectContent>
                                {departements.map((departement) => (
                                    <SelectGroup
                                        key={departement.id_departement}
                                    >
                                        <SelectItem
                                            value={String(departement.id_departement)}
                                        >
                                            {departement.name}
                                        </SelectItem>
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.departement_id && (
                            <p className="text-sm text-red-500">
                                {errors.departement_id}
                            </p>
                        )}
                    </Field>
                </FieldGroup>
            </FieldSet>
            <FieldSet>
                <FieldLegend>Satuan Barang</FieldLegend>
                <FieldDescription>
                    Satuan barang yang digunakan untuk mengukur item ini. Harus
                    ada satu satuan dasar dengan faktor konversi 1.
                </FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Unit of Measure (UOM)</FieldLabel>
                        <div className="mt-2 space-y-2">
                            {/* Header */}
                            <div className="grid grid-cols-[1fr_140px_80px_36px] gap-2 px-1 text-sm font-medium text-muted-foreground">
                                <span>UOM</span>
                                <span>Konversi ke Base</span>
                                <span className="text-center">Base</span>
                                <span />
                            </div>

                            {/* Rows */}
                            {data.uoms.map((uomRow, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-[1fr_140px_80px_36px] items-center gap-2"
                                >
                                    {/* UOM Select */}
                                    <Select
                                        value={uomRow.uom_id}
                                        onValueChange={(v) =>
                                            updateUom(index, 'uom_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih UOM..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {uoms
                                                .filter(
                                                    (u) =>
                                                        !usedUomIds.includes(
                                                            String(u.id_uom),
                                                        ) ||
                                                        String(u.id_uom) ===
                                                            uomRow.uom_id,
                                                )
                                                .map((u) => (
                                                    <SelectItem
                                                        key={u.id_uom}
                                                        value={String(u.id_uom)}
                                                    >
                                                        {u.name} ({u.symbol})
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Conversion Factor */}
                                    <Input
                                        type="number"
                                        min="0.0001"
                                        step="0.0001"
                                        placeholder="1"
                                        disabled={uomRow.is_base}
                                        value={
                                            uomRow.is_base
                                                ? 1
                                                : uomRow.conversion_factor
                                        }
                                        onChange={(e) =>
                                            updateUom(
                                                index,
                                                'conversion_factor',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    {/* Set as Base */}
                                    <div className="flex justify-center">
                                        <input
                                            type="radio"
                                            name="base_uom"
                                            checked={uomRow.is_base}
                                            onChange={() => setAsBase(index)}
                                            className="h-4 w-4 cursor-pointer"
                                        />
                                    </div>

                                    {/* Hapus */}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={data.uoms.length === 1}
                                        onClick={() => removeUom(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}

                            {/* Keterangan konversi */}
                            {data.uoms.length > 1 && (
                                <p className="px-1 text-xs text-muted-foreground">
                                    Contoh: 1 Box = 12 Pcs → isi konversi{' '}
                                    <strong>12</strong> pada baris Box, jadikan
                                    Pcs sebagai Base.
                                </p>
                            )}

                            {/* Tambah UOM */}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addUom}
                                className="mt-1"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Tambah UOM
                            </Button>
                        </div>
                        {errors.uoms && (
                            <p className="text-sm text-red-500">
                                {errors.uoms}
                            </p>
                        )}
                    </Field>
                </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
                <Button onClick={submit} disabled={processing}>
                    {processing
                        ? 'Saving...'
                        : isEditMode
                          ? 'Update Item'
                          : 'Save Item'}
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.visit(route('items.index'))}
                >
                    Cancel
                </Button>
            </Field>
        </FieldGroup>
    );
}
