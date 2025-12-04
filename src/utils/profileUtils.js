import accountsData from '@/data/accounts.json';

/**
 * Interface cho UserProfile
 * @typedef {Object} UserProfile
 * @property {number} id - ID của user
 * @property {string} username - Tên người dùng
 * @property {string} email - Email của user
 * @property {string} password - Mật khẩu của user
 * @property {string} profileImage - Đường dẫn ảnh đại diện
 */

const STORAGE_KEY_SESSION = 'userSession';
const STORAGE_KEY_ACCOUNTS = 'accounts';
const STORAGE_KEY_INITIALIZED = 'accountsInitialized';

/**
 * Khởi tạo accounts từ accounts.json vào localStorage (chỉ chạy 1 lần)
 * @returns {void}
 */
export const initializeAccounts = () => {
  try {
    // Kiểm tra xem đã khởi tạo chưa
    const isInitialized = localStorage.getItem(STORAGE_KEY_INITIALIZED);
    if (isInitialized === 'true') {
      return; // Đã khởi tạo rồi, không làm gì
    }

    // Copy accounts từ JSON vào localStorage
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accountsData));
    localStorage.setItem(STORAGE_KEY_INITIALIZED, 'true');
    console.log('Accounts initialized from accounts.json to localStorage');
  } catch (error) {
    console.error('Error initializing accounts:', error);
  }
};

/**
 * Lấy account hiện tại từ session
 */
export const getCurrentAccountFromSession = () => {
  try {
    const sessionData = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Check if session is still valid
    const now = new Date().getTime();
    if (session.expiresAt && now > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Lấy tất cả accounts từ localStorage
 */
export const getAllAccounts = () => {
  try {
    // Đảm bảo đã khởi tạo
    initializeAccounts();
    
    // Get accounts from localStorage only
    const localAccountsStr = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    const localAccounts = localAccountsStr ? JSON.parse(localAccountsStr) : [];
    
    return localAccounts;
  } catch (error) {
    console.error('Error getting all accounts:', error);
    return [];
  }
};

/**
 * Lấy profile hiện tại từ session
 * @returns {UserProfile} Profile hiện tại
 */
export const getCurrentProfile = () => {
  // Đảm bảo đã khởi tạo
  initializeAccounts();
  
  const session = getCurrentAccountFromSession();
  
  if (session && session.userId) {
    // Find account by userId từ localStorage
    const allAccounts = getAllAccounts();
    const account = allAccounts.find(acc => acc.id === session.userId);
    
    if (account) {
      return {
        id: account.id,
        username: account.username || '',
        email: account.email || '',
        password: account.password || '',
        profileImage: account.profileImage || '/profile-image/avt1.jpg',
        lat: account.lat,
        lng: account.lng,
        prefs: account.prefs || [],
        history: account.history || []
      };
    }
  }
  
  // Fallback: return first account from localStorage
  const allAccounts = getAllAccounts();
  if (allAccounts.length > 0) {
    const firstAccount = allAccounts[0];
    return {
      id: firstAccount.id,
      username: firstAccount.username || '',
      email: firstAccount.email || '',
      password: firstAccount.password || '',
      profileImage: firstAccount.profileImage || '/profile-image/avt1.jpg',
      lat: firstAccount.lat,
      lng: firstAccount.lng,
      prefs: firstAccount.prefs || [],
      history: firstAccount.history || []
    };
  }
  
  // Nếu không có account nào, trả về object rỗng
  return {
    id: 0,
    username: '',
    email: '',
    password: '',
    profileImage: '/profile-image/avt1.jpg',
    lat: undefined,
    lng: undefined,
    prefs: [],
    history: []
  };
};

/**
 * Lưu thông tin profile vào localStorage và cập nhật session
 * @param {UserProfile} profile - Profile cần lưu
 */
export const saveProfileToStorage = (profile) => {
  try {
    // Đảm bảo đã khởi tạo
    initializeAccounts();
    
    // Get all accounts from localStorage
    const allAccounts = getAllAccounts();
    
    // Update account in the list
    const accountIndex = allAccounts.findIndex(acc => acc.id === profile.id);
    if (accountIndex !== -1) {
      // Cập nhật account đã tồn tại
      allAccounts[accountIndex] = {
        ...allAccounts[accountIndex],
        username: profile.username,
        email: profile.email,
        profileImage: profile.profileImage,
        password: profile.password
      };
    } else {
      // Thêm account mới nếu chưa tồn tại
      allAccounts.push({
        ...profile,
        lat: profile.lat,
        lng: profile.lng,
        prefs: profile.prefs || [],
        history: profile.history || [],
        createdAt: profile.createdAt || new Date().toISOString()
      });
    }
    
    // Save updated accounts to localStorage
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(allAccounts));
    
    // Update session data
    const sessionData = getCurrentAccountFromSession();
    if (sessionData && sessionData.userId === profile.id) {
      const updatedSession = {
        ...sessionData,
        username: profile.username,
        email: profile.email,
        profileImage: profile.profileImage
      };
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedSession));
    }
    
    // Save timestamp
    localStorage.setItem('userProfileLastUpdated', new Date().toISOString());
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

/**
 * Validate thông tin profile
 * @param {string} username - Username (tên người dùng) cần validate
 * @param {string} email - Email cần validate
 * @returns {{isValid: boolean, error?: string}} Kết quả validation
 */
export const validateProfile = (username, email) => {
  if (!username || !username.trim()) {
    return {
      isValid: false,
      error: 'usernameRequired'
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
