
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MetricsCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  footer?: ReactNode;
};

const MetricsCard = ({
  title,
  description,
  icon,
  children,
  className,
  isLoading = false,
  footer
}: MetricsCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[120px]">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-repense-red rounded-full animate-spin"></div>
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer && (
        <div className="border-t p-3 bg-muted/30 text-xs">
          {footer}
        </div>
      )}
    </Card>
  );
};

export default MetricsCard;
