import { TriangleAlertIcon, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from './ui/card';

interface CardConfirmationProps {
    title?: string;
    description?: string;
    confirmationText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
}
export default function cardConfirmation({
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmationText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
    onConfirm,
    onCancel,
}: CardConfirmationProps) {
    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="flex">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <TriangleAlertIcon className="h-9 w-9 text-center text-red-700" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-red-700">
                    Are you sure you want to do this?
                </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button
                    disabled={loading}
                    onClick={onConfirm}
                    variant="destructive"
                >
                    {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {loading ? 'Processing...' : confirmationText}
                </Button>
                <Button
                    disabled={loading}
                    onClick={onCancel}
                    variant={'outline'}
                >
                    {cancelText}
                </Button>
            </CardFooter>
        </Card>
    );
}
