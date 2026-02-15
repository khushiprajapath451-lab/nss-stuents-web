import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UrgentPosts } from '@/components/UrgentPosts';
import { CollegeSelector } from '@/components/CollegeSelector';
import { ArrowRight } from 'lucide-react';
import yuvasevaLogo from '@/assets/yuvaseva-logo.png';

export default function Index() {
  const [collegeSelected, setCollegeSelected] = useState(false);

  if (!collegeSelected) {
    return <CollegeSelector onSelect={() => setCollegeSelected(true)} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0xMHY2aC02di02aDZ6bTAgLTEwdjZoLTZ2LTZoNnptLTEwIDEwdjZoLTZ2LTZoNnptMCAxMHY2aC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container relative py-24 lg:py-36 text-center">
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-center">
              <img src={yuvasevaLogo} alt="YuvaSeva" className="h-20 w-20 rounded-2xl shadow-lg" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-white leading-tight">
              YuvaSeva
            </h1>
            <p className="text-lg text-white/80 max-w-md mx-auto">
              Track your volunteer journey, participate in events, and make a difference.
            </p>
            <div className="pt-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="gap-2 shadow-lg text-lg px-8 py-6">
                  LOGIN
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Posts section */}
      <div className="container py-8">
        <UrgentPosts />
      </div>
    </div>
  );
}
