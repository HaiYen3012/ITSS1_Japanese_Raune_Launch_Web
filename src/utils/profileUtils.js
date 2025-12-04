import accountsData from '@/data/accounts.json';

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

const STORAGE_KEY_SESSION = 'userSession';
const STORAGE_KEY_ACCOUNTS = 'accounts';

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
 * Lấy tất cả accounts (từ JSON + localStorage)
 */
export const getAllAccounts = () => {
  try {
    // Get accounts from localStorage
    const localAccountsStr = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    const localAccounts = localAccountsStr ? JSON.parse(localAccountsStr) : [];
    
    // Merge with accounts from JSON (avoid duplicates)
    const allAccounts = [...accountsData];
    localAccounts.forEach(localAcc => {
      if (!allAccounts.find(acc => acc.id === localAcc.id)) {
        allAccounts.push(localAcc);
      }
    });
    
    return allAccounts;
  } catch (error) {
    console.error('Error getting all accounts:', error);
    return accountsData;
  }
};

/**
 * Lấy profile hiện tại từ session
 * @returns {UserProfile} Profile hiện tại
 */
export const getCurrentProfile = () => {
  const session = getCurrentAccountFromSession();
  
  if (session && session.userId) {
    // Find account by userId
    const allAccounts = getAllAccounts();
    const account = allAccounts.find(acc => acc.id === session.userId);
    
    if (account) {
      return {
        id: account.id,
        username: account.username || '',
        name: account.name || '',
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
  
  // Fallback: return first account from JSON
  const firstAccount = accountsData[0];
  return {
    id: firstAccount.id,
    username: firstAccount.username || '',
    name: firstAccount.name || '',
    email: firstAccount.email || '',
    password: firstAccount.password || '',
    profileImage: firstAccount.profileImage || '/profile-image/avt1.jpg',
    lat: firstAccount.lat,
    lng: firstAccount.lng,
    prefs: firstAccount.prefs || [],
    history: firstAccount.history || []
  };
};

/**
 * Lưu thông tin profile vào localStorage và cập nhật session
 * @param {UserProfile} profile - Profile cần lưu
 */
export const saveProfileToStorage = (profile) => {
  try {
    // Get all accounts (from JSON + localStorage)
    const allAccounts = getAllAccounts();
    
    // Update account in the list
    const accountIndex = allAccounts.findIndex(acc => acc.id === profile.id);
    if (accountIndex !== -1) {
      allAccounts[accountIndex] = {
        ...allAccounts[accountIndex],
        username: profile.username,
        name: profile.name,
        email: profile.email,
        profileImage: profile.profileImage,
        password: profile.password
      };
    }
    
    // Get only accounts from localStorage (not from JSON)
    const localAccountsStr = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    const localAccounts = localAccountsStr ? JSON.parse(localAccountsStr) : [];
    
    // Update or add to localStorage accounts
    const localIndex = localAccounts.findIndex(acc => acc.id === profile.id);
    if (localIndex !== -1) {
      localAccounts[localIndex] = allAccounts[accountIndex];
    } else {
      // Only add to localStorage if it's not in the original JSON
      const isInJSON = accountsData.find(acc => acc.id === profile.id);
      if (!isInJSON) {
        localAccounts.push(allAccounts[accountIndex]);
      }
    }
    
    // Save updated local accounts
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(localAccounts));
    
    // Update session data
    const sessionData = getCurrentAccountFromSession();
    if (sessionData && sessionData.userId === profile.id) {
      const updatedSession = {
        ...sessionData,
        username: profile.username,
        name: profile.name,
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
