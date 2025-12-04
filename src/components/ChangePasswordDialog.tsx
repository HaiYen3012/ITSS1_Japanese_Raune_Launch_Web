import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verifyOldPassword, changePassword } from '@/utils/profileUtils';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  password: string;
  profileImage: string;
}

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfile: UserProfile;
  onPasswordChanged: (updatedProfile: UserProfile) => void;
  t: (key: string) => string;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  isOpen,
  onOpenChange,
  currentProfile,
  onPasswordChanged,
  t,
}) => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { toast } = useToast();

  const handleChangePassword = (): void => {
    // Validation
    if (!oldPassword.trim()) {
      toast({
        title: t('profile.validationError') || 'Lỗi',
        description: t('profile.oldPasswordRequired') || 'Vui lòng nhập mật khẩu cũ',
      });
      return;
    }

    if (!newPassword.trim()) {
      toast({
        title: t('profile.validationError') || 'Lỗi',
        description: t('profile.newPasswordRequired') || 'Vui lòng nhập mật khẩu mới',
      });
      return;
    }

    if (newPassword.trim().length < 6) {
      toast({
        title: t('profile.validationError') || 'Lỗi',
        description: t('profile.passwordTooShort') || 'Mật khẩu phải có ít nhất 6 ký tự',
      });
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast({
        title: t('profile.validationError') || 'Lỗi',
        description: t('profile.passwordMismatch') || 'Mật khẩu mới và xác nhận không khớp',
      });
      return;
    }

    // Kiểm tra mật khẩu cũ
    if (!verifyOldPassword(oldPassword.trim(), currentProfile)) {
      toast({
        title: t('profile.validationError') || 'Lỗi',
        description: t('profile.oldPasswordIncorrect') || 'Mật khẩu cũ không chính xác',
      });
      return;
    }

    // Thay đổi mật khẩu
    const updatedProfile = changePassword(currentProfile, newPassword.trim());
    onPasswordChanged(updatedProfile);

    // Reset form
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onOpenChange(false);

    toast({
      title: t('profile.passwordChangeSuccess') || 'Thành công',
      description: t('profile.passwordChangeSuccessDesc') || 'Mật khẩu đã được thay đổi thành công',
    });
  };

  const handleCancel = (): void => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {t('profile.changePassword')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Mật khẩu cũ */}
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="text-base font-semibold">
              {t('profile.oldPassword')}
            </Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="rounded-xl h-12 text-sm"
              placeholder={t('profile.oldPassword')}
            />
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-base font-semibold">
              {t('profile.newPassword')}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl h-12 text-sm"
              placeholder={t('profile.newPassword')}
            />
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-semibold">
              {t('profile.confirmPassword')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl h-12 text-sm"
              placeholder={t('profile.confirmPassword')}
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            {t('profile.cancel')}
          </Button>
          <Button
            onClick={handleChangePassword}
            className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
          >
            <Check className="h-4 w-4 mr-2" />
            {t('profile.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;

