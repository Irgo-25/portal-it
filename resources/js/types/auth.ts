export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Item = {
    id_item: number;
    code: string;
    name: string;
    category_id: number;
    departement_id: number;
    stock: number;
    category?: Category;
    departement?: Departement;
    item_uoms: ItemUom[];
    created_at: string;
    updated_at: string;
};

export type Departement = {
    id_departement: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
};

export type Category = {
    id_category: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

export type Uom = {
    id_uom: number;
    name: string;
    symbol: string;
    created_at: string;
    updated_at: string;
};
export type ItemUom = {
    id_item_uom?: number;
    uom_id: string;
    is_base: boolean;
    conversion_factor: number | string;
    uom?: Uom;
};

export interface ItemUomData {
    id?: number;
    uom_id: string;
    is_base: boolean;
    conversion_factor: number | string;
    uom?: Uom;
}

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
