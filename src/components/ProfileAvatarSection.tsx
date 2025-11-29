import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Check } from 'lucide-react';
import ProfileImageUpload from '@/components/ProfileImageUpload';

interface ProfileAvatarSectionProps {
  profileImage: string;
  name: string;
  onImageChange: (imagePath: string) => void;
  availableImages: string[];
  t: (key: string) => string;
}

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  profileImage,
  name,
  onImageChange,
  availableImages,
  t,
}) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);

  const handleImageSelect = (imagePath: string): void => {
    onImageChange(imagePath);
    setIsImageDialogOpen(false);
  };

  const handleImageUpload = (imageDataUrl: string): void => {
    onImageChange(imageDataUrl);
    setIsImageDialogOpen(false);
  };

  return (
    <>
      {/* Phần ảnh hồ sơ với nút thay đổi */}
      <div className="flex flex-col items-center gap-5 mb-9">
        <div className="relative group">
          <Avatar className="h-44 w-44 border-4 border-white shadow-xl ring-4 ring-orange-200/50">
            <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
            <AvatarFallback className="bg-white text-orange-500 text-3xl font-bold">
              {name.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {/* Nút thay đổi ảnh với icon */}
          <Button
            onClick={() => setIsImageDialogOpen(true)}
            className="absolute -bottom-2 -right-2 rounded-full h-12 w-12 bg-white text-orange-500 hover:bg-orange-50 shadow-lg border-2 border-orange-200 p-0 transition-all duration-200 hover:scale-110"
            size="icon"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Dialog chọn ảnh */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {t('profile.selectImage')}
            </DialogTitle>
          </DialogHeader>
          
          {/* Component upload ảnh */}
          <div className="flex justify-center mb-4">
            <ProfileImageUpload
              onImageUpload={handleImageUpload}
              t={t}
            />
          </div>

          {/* Danh sách ảnh có sẵn */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 p-5">
            {availableImages.map((imagePath, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(imagePath)}
                className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all duration-200 transform hover:scale-105 ${
                  profileImage === imagePath
                    ? 'border-orange-500 ring-4 ring-orange-200 shadow-xl'
                    : 'border-gray-200 hover:border-orange-300 shadow-md hover:shadow-lg'
                }`}
              >
                <img
                  src={imagePath}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {profileImage === imagePath && (
                  <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-orange-500 rounded-full p-1.5">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileAvatarSection;
