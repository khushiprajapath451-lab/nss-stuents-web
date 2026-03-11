import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseItem {
  id: string;
  name: string;
  cost: number;
  quantity: number;
}

const defaultItems: ExpenseItem[] = [
  { id: '1', name: 'Banner Printing', cost: 500, quantity: 0 },
  { id: '2', name: 'Poster Printing', cost: 200, quantity: 0 },
  { id: '3', name: 'Certificates', cost: 30, quantity: 0 },
  { id: '4', name: 'Volunteer Badges', cost: 50, quantity: 0 },
  { id: '5', name: 'Water Bottles', cost: 20, quantity: 0 },
  { id: '6', name: 'Stationery', cost: 150, quantity: 0 },
  { id: '7', name: 'Stage Setup', cost: 3000, quantity: 0 },
  { id: '8', name: 'Sound System', cost: 2000, quantity: 0 },
  { id: '9', name: 'Photography', cost: 1500, quantity: 0 },
  { id: '10', name: 'Transportation', cost: 1000, quantity: 0 },
];

export function EventExpensePlanner() {
  const [items, setItems] = useState<ExpenseItem[]>(defaultItems);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');

  const updateItem = (id: string, field: 'cost' | 'quantity', value: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    if (!newName || !newCost) { toast.error('Enter item name and cost.'); return; }
    setItems(prev => [...prev, {
      id: String(Date.now()),
      name: newName,
      cost: parseFloat(newCost) || 0,
      quantity: 0,
    }]);
    setNewName('');
    setNewCost('');
    toast.success('Item added.');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.cost * i.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Event Expense Planner</CardTitle>
        <p className="text-sm text-muted-foreground">Estimate costs for NSS event materials.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead className="w-[120px]">Cost (₹)</TableHead>
              <TableHead className="w-[100px]">Quantity</TableHead>
              <TableHead className="w-[120px]">Total (₹)</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={item.cost}
                    onChange={e => updateItem(item.id, 'cost', parseFloat(e.target.value) || 0)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell className="font-medium">₹{(item.cost * item.quantity).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center gap-2">
          <Input placeholder="New item name" value={newName} onChange={e => setNewName(e.target.value)} className="max-w-[200px]" />
          <Input type="number" placeholder="Cost" value={newCost} onChange={e => setNewCost(e.target.value)} className="max-w-[120px]" />
          <Button variant="outline" size="sm" onClick={addItem} className="gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
          <span className="font-semibold">Total Estimated Cost</span>
          <span className="text-2xl font-bold text-primary">₹{total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
