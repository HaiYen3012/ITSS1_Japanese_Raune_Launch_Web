import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, formatDistance } from '@/utils/distance';
import restaurantsData from '@/data/restaurants.json';
import menusData from '@/data/menus.json';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useGeolocation();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  );
  const [priceRanges, setPriceRanges] = useState<string[]>(
    searchParams.get('price')?.split(',').filter(Boolean) || []
  );
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Vietnamese', 'Asian', 'Western', 'Cafe', 'Fast Food'];

  const filteredRestaurants = useMemo(() => {
    let results = [...restaurantsData];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.address.toLowerCase().includes(query) ||
          r.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
      results = results.filter((r) => selectedCategories.includes(r.category));
    }

    // Calculate distances and attach featured dishes
    const withDistance = results.map((r) => {
      const distance = calculateDistance(location.lat, location.lng, r.lat, r.lng);
      
      // Get dishes for this restaurant
      let dishes = menusData.filter((d) => d.restaurantId === r.id);
      
      // Filter dishes by search query if exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchingDishes = dishes.filter((d) => 
          d.name.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query)
        );
        // If there are matching dishes, show them; otherwise show top 3 dishes
        dishes = matchingDishes.length > 0 ? matchingDishes.slice(0, 3) : dishes.slice(0, 3);
      } else {
        // Show top 3 highest rated dishes
        dishes = dishes.sort((a, b) => b.rating - a.rating).slice(0, 3);
      }
      
      return {
        ...r,
        distance,
        dishes,
      };
    });

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        withDistance.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        withDistance.sort((a, b) => a.distance - b.distance);
        break;
      case 'reviews':
        withDistance.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return withDistance;
  }, [searchQuery, selectedCategories, sortBy, location.lat, location.lng]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (sortBy !== 'rating') params.set('sort', sortBy);
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    setSearchParams(params);
  };

  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header location="Your location" userName="Customer" />

      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Search & Filters Panel */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search restaurants, dishes, or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Filters */}
            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
              {/* Sort */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="distance">Closest</SelectItem>
                      <SelectItem value="reviews">Most Reviewed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Categories */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isSelected =
                      category === 'All'
                        ? selectedCategories.length === 0
                        : selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Restaurants ({filteredRestaurants.length})
          </h2>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No restaurants found.{' '}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                }}
                className="text-primary hover:underline"
              >
                Try clearing filters
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                address={restaurant.address}
                distance={formatDistance(restaurant.distance)}
                rating={restaurant.rating}
                reviews={restaurant.reviews}
                tags={restaurant.tags}
                photo={restaurant.photo}
                category={restaurant.category}
                dishes={restaurant.dishes}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;
