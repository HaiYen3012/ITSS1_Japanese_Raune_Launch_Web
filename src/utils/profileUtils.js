import userProfileData from '@/data/userProfile.json';

/**
 * Interface cho UserProfile
 * @typedef {Object} UserProfile
 * @property {number} id - ID của user
 * @property {string} username - Tên đăng nhập của user
 * @property {string} name - Tên của user
 * @property {string} email - Email của user
 * @property {string} password - Mật khẩu của user
 * @property {string} profileImage - Đường dẫn ảnh đại diện
 */

const STORAGE_KEY_PROFILES = 'userProfiles';
const STORAGE_KEY_CURRENT_PROFILE = 'currentUserProfile';
const STORAGE_KEY_INITIALIZED = 'userProfilesInitialized';

/**
 * Khởi tạo dữ liệu từ JSON vào localStorage (chỉ chạy 1 lần)
 * Nếu localStorage chưa có dữ liệu, sẽ sync toàn bộ từ file JSON
 */
export const initializeProfilesFromJSON = () => {
  // Kiểm tra xem đã khởi tạo chưa
  const isInitialized = localStorage.getItem(STORAGE_KEY_INITIALIZED);
  
  if (!isInitialized) {
    // Lưu toàn bộ profiles từ JSON vào localStorage
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(userProfileData));
    
    // Set profile đầu tiên làm profile hiện tại
    const firstProfile = userProfileData[0] || {
      id: 1,
      username: '',
      name: '',
      email: '',
      password: '',
      profileImage: '/profile-image/avt1.jpg'
    };
    localStorage.setItem(STORAGE_KEY_CURRENT_PROFILE, JSON.stringify(firstProfile));
    
    // Đánh dấu đã khởi tạo
    localStorage.setItem(STORAGE_KEY_INITIALIZED, 'true');
    
    return firstProfile;
  }
  
  return null;
};

/**
 * Lấy profile hiện tại từ localStorage
 * Nếu chưa có, sẽ khởi tạo từ JSON trước
 * @returns {UserProfile} Profile hiện tại
 */
export const getCurrentProfile = () => {
  // Khởi tạo từ JSON nếu chưa có
  const initialized = initializeProfilesFromJSON();
  if (initialized) {
    return initialized;
  }
  
  // Lấy từ localStorage
  const saved = localStorage.getItem(STORAGE_KEY_CURRENT_PROFILE);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing profile from localStorage:', error);
    }
  }
  
  // Fallback: lấy từ JSON nếu localStorage lỗi
  return userProfileData[0] || {
    id: 1,
    username: '',
    name: '',
    email: '',
    password: '',
    profileImage: '/profile-image/avt1.jpg'
  };
};

/**
 * Lấy tất cả profiles từ localStorage
 * @returns {UserProfile[]} Danh sách profiles
 */
export const getAllProfiles = () => {
  const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing profiles from localStorage:', error);
    }
  }
  
  // Fallback: trả về từ JSON
  return userProfileData;
};

/**
 * Lưu thông tin profile vào localStorage (chỉ khi nhấn nút cập nhật)
 * @param {UserProfile} profile - Profile cần lưu
 */
export const saveProfileToStorage = (profile) => {
  // Lấy danh sách profiles hiện tại từ localStorage
  const allProfiles = getAllProfiles();
  
  // Cập nhật profile trong danh sách
  const updatedProfiles = allProfiles.map(p =>
    p.id === profile.id ? profile : p
  );

  // Lưu danh sách profiles đã cập nhật vào localStorage
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(updatedProfiles));
  
  // Lưu profile hiện tại vào localStorage
  localStorage.setItem(STORAGE_KEY_CURRENT_PROFILE, JSON.stringify(profile));

  // Lưu timestamp để biết khi nào cập nhật
  localStorage.setItem('userProfileLastUpdated', new Date().toISOString());
};

/**
 * Validate thông tin profile
 * @param {string} username - Username cần validate
 * @param {string} name - Tên cần validate
 * @param {string} email - Email cần validate
 * @returns {{isValid: boolean, error?: string}} Kết quả validation
 */
export const validateProfile = (username, name, email) => {
  if (!username || !username.trim()) {
    return {
      isValid: false,
      error: 'usernameRequired'
    };
  }

  if (!name || !name.trim()) {
    return {
      isValid: false,
      error: 'nameRequired'
    };
  }

  if (!email || !email.trim() || !email.includes('@')) {
    return {
      isValid: false,
      error: 'emailInvalid'
    };
  }

  return {
    isValid: true
  };
};

/**
 * Kiểm tra mật khẩu cũ có đúng không
 * @param {string} oldPassword - Mật khẩu cũ người dùng nhập
 * @param {UserProfile} profile - Profile hiện tại
 * @returns {boolean} True nếu mật khẩu đúng
 */
export const verifyOldPassword = (oldPassword, profile) => {
  return profile.password === oldPassword;
};

/**
 * Thay đổi mật khẩu
 * @param {UserProfile} profile - Profile hiện tại
 * @param {string} newPassword - Mật khẩu mới
 */
export const changePassword = (profile, newPassword) => {
  const updatedProfile = {
    ...profile,
    password: newPassword
  };
  saveProfileToStorage(updatedProfile);
  return updatedProfile;
};

/**
 * Danh sách ảnh đại diện có sẵn
 */
export const availableImages = [
  '/profile-image/avt1.jpg',
  '/profile-image/avt2.jpg',
  '/profile-image/avt3.jpg',
  '/profile-image/avt4.jpg',
  '/profile-image/avt5.jpg',
  '/profile-image/avt6.jpg',
  '/profile-image/avt7.jpg',
  '/profile-image/avt8.jpg',
];
