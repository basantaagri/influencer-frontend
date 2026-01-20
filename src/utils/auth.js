const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";

// ----------------------------------
// SAVE AUTH DATA
// ----------------------------------
export function saveAuth(token, role) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

// ----------------------------------
// GET TOKEN
// ----------------------------------
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ----------------------------------
// GET ROLE
// ----------------------------------
export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

// ----------------------------------
// AUTH CHECK
// ----------------------------------
export function isLoggedIn() {
  return !!getToken();
}

// ----------------------------------
// LOGOUT
// ----------------------------------
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}
