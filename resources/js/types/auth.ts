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
    description: string;
    id_category: number;
    id_uom: number;
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
