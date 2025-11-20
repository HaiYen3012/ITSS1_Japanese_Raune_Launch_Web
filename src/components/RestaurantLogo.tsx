interface RestaurantLogoProps {
  name: string;
  photo: string;
}

export function RestaurantLogo({ name, photo }: RestaurantLogoProps) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center space-y-2">
      <div className="w-32 h-32 bg-card rounded-full shadow-lg overflow-hidden border-4 border-background hover:scale-105 transition-transform duration-300">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="text-sm font-medium text-center text-foreground max-w-[120px] line-clamp-2">
        {name}
      </p>
    </div>
  );
}
