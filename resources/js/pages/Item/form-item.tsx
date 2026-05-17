import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    data: {
        name: string;
        email: string;
        password: string;
    };
    setData: (key: string, value: string) => void;
    errors: Record<string, string>;
    isEdit?: boolean;
};

export default function FormUser({
    data,
    setData,
    errors,
    isEdit = false,
}: Props) {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <Label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="name"
                >
                    Name
                </Label>
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>
            <div className="space-y-1">
                <Label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="email"
                >
                    Email
                </Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full"
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                )}
            </div>
            <div>
                <Label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="password"
                >
                    Password{' '}
                    {isEdit && (
                        <span className="text-sm text-gray-500">
                            (Leave blank to keep current password)
                        </span>
                    )}
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full"
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                )}
            </div>
        </div>
    );
}
