import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface HeaderProps {
  location?: string;
  userName?: string;
}

export function Header({ location = "Hai Bà Trưng, Hanoi", userName = "Customer" }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">
              Raune Launch
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-foreground hover:text-primary transition-colors">
              Search
            </Link>
            <a href="#recommendations-dishes" className="text-foreground hover:text-primary transition-colors">
              Recommendations
            </a>
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">{location}</span>
            </div>

            {/* Search button */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-sm border border-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-l-none"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {/* Mobile search icon */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => navigate('/search')}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* User profile */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-lg">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium hidden sm:inline">{userName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
