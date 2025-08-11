import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, DollarSign, Users, Calendar, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const STATUS_COLORS = {
  'for_sale': 'bg-green-100 text-green-800',
  'under_review': 'bg-yellow-100 text-yellow-800',
  'sold': 'bg-blue-100 text-blue-800',
  'not_for_sale': 'bg-gray-100 text-gray-800'
};

export default function SalePortfolios({ portfolios, onSelectPortfolio }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    description: '',
    asking_price: '',
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreatePortfolio = () => {
    // Handle portfolio creation logic here
    console.log('Creating portfolio:', newPortfolio);
    setShowCreateDialog(false);
    setNewPortfolio({ name: '', description: '', asking_price: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolios for Sale</h2>
          <p className="text-muted-foreground">Manage portfolios available for external debt buyers</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Sale Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Portfolio for Sale</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Portfolio Name</Label>
                <Input
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
                  placeholder="Enter portfolio name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                  placeholder="Describe the portfolio contents and characteristics"
                />
              </div>
              <div>
                <Label>Asking Price</Label>
                <Input
                  type="number"
                  value={newPortfolio.asking_price}
                  onChange={(e) => setNewPortfolio({...newPortfolio, asking_price: e.target.value})}
                  placeholder="Enter asking price"
                />
              </div>
              <Button onClick={handleCreatePortfolio} className="w-full">
                Create Portfolio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                <Badge className={STATUS_COLORS[portfolio.sale_status]}>
                  {portfolio.sale_status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{portfolio.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{portfolio.account_count?.toLocaleString()} accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>{formatCurrency(portfolio.original_face_value)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(portfolio.created_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(portfolio.asking_price)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Top States</h4>
                <div className="flex flex-wrap gap-1">
                  {portfolio.top_states?.slice(0, 3).map((state) => (
                    <Badge key={state.state} variant="outline" className="text-xs">
                      {state.state} {state.percentage}%
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => onSelectPortfolio(portfolio)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolios.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No portfolios for sale</p>
              <p className="text-sm">Create your first portfolio to make it available for external buyers</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}