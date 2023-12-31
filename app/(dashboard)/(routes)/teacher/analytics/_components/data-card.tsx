import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type DataCardProps = {
  label: string;
  value: number;
  shouldFormat?: boolean;
};

function DataCard({ label, value, shouldFormat = false }: DataCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">
          {shouldFormat ? formatCurrency(value) : value}
        </div>
      </CardContent>
    </Card>
  );
}

export default DataCard;
