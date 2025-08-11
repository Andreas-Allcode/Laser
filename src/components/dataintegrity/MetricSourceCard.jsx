
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Calculator, Code, Layers } from 'lucide-react';

export default function MetricSourceCard({ title, value, description, area, sources }) {
  return (
    <Card className="bg-white border flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-foreground text-lg">{title}</CardTitle>
          <Badge variant="outline" className="text-xs bg-white">{area}</Badge>
        </div>
        <p className="text-3xl font-bold text-foreground pt-2">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.map((source, index) => (
            <div key={index} className="space-y-3 p-3 rounded-lg bg-white border border-border">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-foreground">Entity:</span>
                <Badge variant="secondary" className="font-mono">{source.entity}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-foreground">Field:</span>
                <span className="font-mono text-sm text-muted-foreground">{source.field}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-foreground">Logic:</span>
                <span className="font-mono text-sm text-muted-foreground">{source.logic}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
         <div className="w-full">
            <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-600" />
                <p className="text-sm font-semibold text-orange-700">Validation Logic Example</p>
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">
                {sources[0].query}
            </p>
         </div>
      </CardFooter>
    </Card>
  );
}
