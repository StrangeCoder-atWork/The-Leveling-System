export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

export const validateUserData = (userData) => {
  if (!userData) return false;
  
  // Basic validation for user state
  const validations = {
    xp: typeof userData.xp === 'number' && userData.xp >= 0,
    money: typeof userData.money === 'number' && userData.money >= 0,
    level: typeof userData.level === 'number' && userData.level >= 1,
    rank: typeof userData.rank === 'string' && userData.rank.length > 0,
    profession: typeof userData.profession === 'string' && userData.profession.length > 0
  };
  
  return Object.values(validations).every(valid => valid);
};