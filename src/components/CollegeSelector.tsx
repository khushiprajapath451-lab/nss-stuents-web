import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraduationCap, ChevronRight } from 'lucide-react';

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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl hero-gradient shadow-glow">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>

          <div>
            <h1 className="text-2xl font-bold font-display">NSS Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Select your college to continue</p>
          </div>

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
