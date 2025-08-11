import React from 'react';
import { Palette, Type, Layout, Component } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function StyleGuide() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">LASER Platform Style Guide</h1>
        <p className="text-xl text-muted-foreground">Design system documentation for fonts, colors, and styling</p>
      </div>

      {/* Color Palette Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">Color Palette</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Primary Colors</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary"></div>
                <div>
                  <div className="font-mono text-sm">--primary</div>
                  <div className="text-muted-foreground text-sm">#2196f3</div>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-50 border"></div>
                <div>
                  <div className="font-mono text-sm">Baby Blue</div>
                  <div className="text-muted-foreground text-sm">bg-blue-50</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-secondary"></div>
                <div>
                  <div className="font-mono text-sm">--secondary</div>
                  <div className="text-muted-foreground text-sm">#f1f5f9</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Status Colors</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-green-500"></div>
                <div>
                  <div className="font-mono text-sm">Success</div>
                  <div className="text-muted-foreground text-sm">#4caf50</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-yellow-500"></div>
                <div>
                  <div className="font-mono text-sm">Warning</div>
                  <div className="text-muted-foreground text-sm">#ff9800</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-destructive"></div>
                <div>
                  <div className="font-mono text-sm">--destructive</div>
                  <div className="text-muted-foreground text-sm">#f44336</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Surface Colors</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded border bg-background"></div>
                <div>
                  <div className="font-mono text-sm">--background</div>
                  <div className="text-muted-foreground text-sm">#f8fafc</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded border bg-card"></div>
                <div>
                  <div className="font-mono text-sm">--card</div>
                  <div className="text-muted-foreground text-sm">#ffffff</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded border bg-muted"></div>
                <div>
                  <div className="font-mono text-sm">--muted</div>
                  <div className="text-muted-foreground text-sm">#f1f5f9</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* ... Other sections would be updated similarly ... */}
    </div>
  );
}