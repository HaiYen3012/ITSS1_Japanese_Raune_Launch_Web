import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface DishCardProps {
  dishId: number;
  name: string | { vi: string; ja: string };
  restaurantName: string;
  restaurantId: number;
  distance: string;
  rating: number;
  reviews: number;
  price: number;
  photo: string;
  onViewDetails?: () => void;
}

export function DishCard({
  dishId,
  name,
  restaurantName,
  restaurantId,
  distance,
  rating,
  reviews,
  price,
  photo,
  onViewDetails,
}: DishCardProps) {
  const { t, language } = useLanguage();

  // Lấy tên món ăn theo ngôn ngữ hiện tại
  const getDishName = () => {
    if (typeof name === 'string') {
      return name;
    }
    return name[language as keyof typeof name] || name.vi;
  };

  const dishName = getDishName();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    }
  };

  return (
    <div className="flex-shrink-0 w-64 bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div 
        className="cursor-pointer"
        onClick={handleViewDetails}
      >
        <img
          src={photo}
          alt={dishName}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 
          className="font-bold text-lg text-card-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
          onClick={handleViewDetails}
        >
          {dishName}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {restaurantName}
        </p>
        <p className="text-xs text-accent font-medium mt-1">{distance} {t('common.away')}</p>
        
        <div className="flex items-center mt-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm ml-1 text-foreground">
            {rating} <span className="text-muted-foreground">({reviews} {t('common.reviews')})</span>
          </span>
        </div>
        
        <p className="text-sm font-semibold text-primary mt-2 mb-3">
          {price.toLocaleString('vi-VN')} VND
        </p>
        
        <Button
          onClick={handleViewDetails}
          className="w-full mt-auto"
          size="sm"
        >
          {t('common.viewDetails')}
        </Button>
      </div>
    </div>
  );
}
