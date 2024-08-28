export const getLuggageStatus = async () => {
    const response = await fetch('/api/luggage');
    const data = await response.json();
    return data;
  };
  
  export const getUserProfile = async () => {
    const response = await fetch('/api/user/profile');
    const data = await response.json();
    return data;
  };
  