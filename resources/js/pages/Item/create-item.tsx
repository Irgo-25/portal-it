import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    FieldGroup,
    Field,
    FieldSet,
    FieldLegend,
    FieldLabel,
    FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue,
} from '@/components/ui/select';
import type { Category, Departement, Uom, ItemUom } from '@/types';

interface createItemProps {
    code: string;
    categories: Category[];
    departements: Departement[];
    uoms: Uom[];
}

export default function CreateItem({
    code,
    categories,
    departements,
    uoms,
}: createItemProps) {
    const { data, setData, post, processing, errors } = useForm({
        code,
        name: '',
        category_id: '',
        departement_id: '',
        uoms: [
            { uom_id: '', is_base: true, conversion_factor: 1 },
        ] as ItemUom[],
    });

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
        value: string | boolean,
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
        <div className="p-4">
            <Head title="Create Item" />
            <Card className="mx-auto w-full">
                <CardContent>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Create Item</FieldLegend>
                            <FieldDescription>
                                Fill in the details below to create a new item.
                            </FieldDescription>
                            <FieldGroup className="grid grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="code">
                                        Item Code
                                    </FieldLabel>
                                    <Input
                                        id="code"
                                        disabled
                                        value={code || 'AUTO-GENERATED'}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Item Name
                                    </FieldLabel>
                                    <Input
                                        id="name"
                                        placeholder="Evil Rabbit"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="category_id">
                                        Category
                                    </FieldLabel>
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
                                                <SelectGroup key={category.id}>
                                                    <SelectItem
                                                        value={category.id.toString()}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                                    key={departement.id}
                                                >
                                                    <SelectItem
                                                        value={departement.id.toString()}
                                                    >
                                                        {departement.name}
                                                    </SelectItem>
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSet>
                            <FieldLegend>Satuan Barang</FieldLegend>
                            <FieldDescription>
                                Satuan barang yang digunakan untuk mengukur item
                                ini. Harus ada satu satuan dasar dengan faktor
                                konversi 1.
                            </FieldDescription>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>
                                        Unit of Measure (UOM)
                                    </FieldLabel>
                                    <div className="mt-2 space-y-2">
                                        {/* Header */}
                                        <div className="grid grid-cols-[1fr_140px_80px_36px] gap-2 px-1 text-sm font-medium text-muted-foreground">
                                            <span>UOM</span>
                                            <span>Konversi ke Base</span>
                                            <span className="text-center">
                                                Base
                                            </span>
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
                                                        updateUom(
                                                            index,
                                                            'uom_id',
                                                            v,
                                                        )
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
                                                                        String(
                                                                            u.id,
                                                                        ),
                                                                    ) ||
                                                                    String(
                                                                        u.id,
                                                                    ) ===
                                                                        uomRow.uom_id,
                                                            )
                                                            .map((u) => (
                                                                <SelectItem
                                                                    key={u.id}
                                                                    value={String(
                                                                        u.id,
                                                                    )}
                                                                >
                                                                    {u.name} (
                                                                    {u.symbol})
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
                                                        onChange={() =>
                                                            setAsBase(index)
                                                        }
                                                        className="h-4 w-4 cursor-pointer"
                                                    />
                                                </div>

                                                {/* Hapus */}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={
                                                        data.uoms.length === 1
                                                    }
                                                    onClick={() =>
                                                        removeUom(index)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}

                                        {/* Keterangan konversi */}
                                        {data.uoms.length > 1 && (
                                            <p className="px-1 text-xs text-muted-foreground">
                                                Contoh: 1 Box = 12 Pcs → isi
                                                konversi <strong>12</strong>{' '}
                                                pada baris Box, jadikan Pcs
                                                sebagai Base.
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
                            <Button
                                onClick={() => post(route('items.store'))}
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Item'}
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() =>
                                    router.visit(route('items.index'))
                                }
                            >
                                Cancel
                            </Button>
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
        </div>
    );
}

CreateItem.layout = {
    breadcrumbs: [
        {
            title: 'Items',
            href: route('items.index'),
        },
        {
            title: 'Create Item',
            href: route('items.create'),
        },
    ],
};
