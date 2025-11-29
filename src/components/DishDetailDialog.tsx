import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Star, MapPin, Clock, DollarSign, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistance, calculateDistance } from '@/utils/distance';
import { useGeolocation } from '@/hooks/useGeolocation';

interface DishDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish: {
    id: number;
    restaurantId: number;
    name: string | { vi: string; ja: string };
    category: string;
    price: number;
    rating: number;
    reviews: number;
    photo: string;
  };
  restaurant: {
    id: number;
    name: string;
    address: string;
    lat: number;
    lng: number;
    rating: number;
    reviews: number;
    photo: string;
  };
}

export function DishDetailDialog({
  open,
  onOpenChange,
  dish,
  restaurant,
}: DishDetailDialogProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useGeolocation();

  // Calculate distance
  const distance = calculateDistance(location.lat, location.lng, restaurant.lat, restaurant.lng);

  // Helper to get dish name
  const getDishName = (dishName: string | { vi: string; ja: string }) => {
    if (typeof dishName === 'string') {
      return dishName;
    }
    return dishName[language as keyof typeof dishName] || dishName.vi;
  };

  const dishName = getDishName(dish.name);

  const handleViewRestaurant = () => {
    onOpenChange(false);
    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left Column - Image (3 columns) */}
          <div className="relative md:col-span-3">
            <img
              src={dish.photo}
              alt={dishName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              {dish.price.toLocaleString('vi-VN')} ₫
            </div>
          </div>

          {/* Right Column - Details (2 columns) */}
          <div className="p-6 space-y-3 md:col-span-2 overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full font-medium">
                  {t(`categories.${dish.category.toLowerCase()}`) || dish.category}
                </span>
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
                {dishName}
              </DialogTitle>
            </DialogHeader>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold text-foreground">
                  {dish.rating}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(dish.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {dish.reviews} {t('common.reviews')}
                </p>
              </div>
            </div>

            {/* Price & Info */}
            <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">
                    {t('dishDetail.price')}
                  </span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {dish.price.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {t('dishDetail.prepTime')}: {t('dishDetail.prepTimeValue')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {formatDistance(distance)} {t('common.away')}
                  </span>
                </div>
              </div>
            </div>

            {/* Restaurant Info */}
            <div 
              className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={handleViewRestaurant}
            >
              <div className="flex items-center gap-3">
                <img
                  src={restaurant.photo}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors">
                    {restaurant.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{restaurant.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({restaurant.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="font-bold text-sm text-foreground mb-1.5">
                {t('dishDetail.description')}
              </h4>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {t('dishDetail.descriptionText', {
                  dish: dishName,
                  restaurant: restaurant.name,
                  category: t(`categories.${dish.category.toLowerCase()}`),
                })}
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-1">
              <Button
                onClick={handleViewRestaurant}
                className="w-full py-5 font-semibold"
                size="lg"
              >
                {t('dishDetail.viewRestaurant')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

