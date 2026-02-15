import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronRight } from 'lucide-react';


interface CollegeSelectorProps {
  onSelect: (college: string) => void;
}

const colleges = [
  { id: 'vardhaman', name: 'Vardhaman College of Engineering' },
  { id: 'other1', name: 'Coming Soon...', disabled: true },
];

export function CollegeSelector({ onSelect }: CollegeSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative animate-fade-in shadow-elevated">
        <CardContent className="pt-8 pb-8 space-y-6 text-center">
          <p className="text-base font-semibold text-foreground">Select your college to continue</p>

          <Select defaultValue="vardhaman">
            <SelectTrigger className="w-full text-left">
              <SelectValue placeholder="Select your college" />
            </SelectTrigger>
            <SelectContent>
              {colleges.map((c) => (
                <SelectItem key={c.id} value={c.id} disabled={c.disabled}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full gap-2 shadow-glow"
            size="lg"
            onClick={() => onSelect('vardhaman')}
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
