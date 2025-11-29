import { useNavigate } from 'react-router-dom';

interface RestaurantLogoProps {
  id: number;
  name: string;
  photo: string;
}

export function RestaurantLogo({ id, name, photo }: RestaurantLogoProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer"
      onClick={() => navigate(`/restaurant/${id}`)}
    >
      <div className="w-32 h-32 bg-card rounded-full shadow-lg overflow-hidden border-4 border-background hover:scale-105 transition-transform duration-300">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="text-sm font-medium text-center text-foreground max-w-[120px] line-clamp-2 hover:text-primary transition-colors">
        {name}
      </p>
    </div>
  );
}
