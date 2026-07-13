export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function hasRole(...roles) {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}