import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

type Props = {
  variant: 'default' | 'destructive';
  title: string;
  description: string;
};
export function AlertDestructive(props: Props) {
  const { variant, title, description } = props;

  return (
    <Alert variant={variant} className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
