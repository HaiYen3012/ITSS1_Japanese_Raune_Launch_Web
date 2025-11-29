import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Upload, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageUploadProps {
  onImageUpload: (imageDataUrl: string) => void;
  t: (key: string) => string;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  onImageUpload,
  t,
}) => {
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: t('profile.validationError') || 'Lỗi',
        description: t('profile.invalidImageFormat') || 'Định dạng hình ảnh không hợp lệ. Vui lòng chọn PNG hoặc JPEG',
      });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t('profile.validationError') || 'Lỗi',
        description: t('profile.imageTooLarge') || 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 20MB',
      });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedImagePreview(result);
      setIsPreviewDialogOpen(true);
    };
    reader.onerror = () => {
      toast({
        title: t('profile.validationError') || 'Lỗi',
        description: 'Có lỗi xảy ra khi đọc file',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = (): void => {
    if (uploadedImagePreview) {
      onImageUpload(uploadedImagePreview);
      setUploadedImagePreview(null);
      setIsPreviewDialogOpen(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancelUpload = (): void => {
    setUploadedImagePreview(null);
    setIsPreviewDialogOpen(false);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Input file ẩn */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Nút upload ảnh */}
      <Button
        onClick={handleUploadClick}
        className="bg-orange-500 text-white hover:bg-orange-600 rounded-lg px-6 py-3 transition-all duration-200"
      >
        <Upload className="h-4 w-4 mr-2" />
        {t('profile.uploadImage')}
      </Button>

      {/* Dialog preview ảnh đã upload */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {t('profile.previewImage')}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {uploadedImagePreview && (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-orange-200">
                <img
                  src={uploadedImagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelUpload}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              {t('profile.cancel')}
            </Button>
            <Button
              onClick={handleConfirmUpload}
              className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
            >
              <Check className="h-4 w-4 mr-2" />
              {t('profile.confirmUpload')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileImageUpload;

