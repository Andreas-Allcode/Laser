import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react';

const SummaryCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="bg-card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div><p className="text-sm font-medium text-muted-foreground">{title}</p><p className={`text-2xl font-bold ${colorClass}`}>{value}</p></div>
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </div>
    </CardContent>
  </Card>
);

export default function BuyBackSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard title="Pending Review" value="72" icon={AlertTriangle} colorClass="text-yellow-600" />
      <SummaryCard title="Under Review" value="15" icon={Clock} colorClass="text-blue-600" />
      <SummaryCard title="Approved (30d)" value="128" icon={CheckCircle} colorClass="text-green-600" />
      <SummaryCard title="Buy Back Value (Pending)" value="$1.2M" icon={DollarSign} colorClass="text-primary" />
    </div>
  );
}