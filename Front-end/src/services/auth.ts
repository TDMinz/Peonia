import { API_BASE_URL } from './api';

type LoginPayload = { username: string; password: string };
type RegisterPayload = { full_name: string; username: string; password: string; email?: string };
type ChangePasswordPayload = { current_password: string; new_password: string };
type ForgotPasswordPayload = { email: string };
type VerifyResetCodePayload = { email: string; code: string };
type ResetPasswordPayload = { email: string; code: string; new_password: string };
type GoogleLoginPayload = { credential: string };

type AuthUser = {
  id: string;
  username: string;
  full_name?: string;
  email?: string;
  role: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

type MessageResponse = {
  message: string;
};
function getAuthToken() {
  return localStorage.getItem('peonia_token') || '';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),


    },
  });

  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();
  let data: unknown = null;
  if (raw) data = contentType.includes('application/json') ? JSON.parse(raw) : { message: raw };
  if (!response.ok) {
    throw new Error(
      (data as { message?: string })?.message ??
        `Request failed: ${response.status}`
    );
  }
  
  return data as T;
 
}

export const authApi = {
  login: (payload: LoginPayload) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: RegisterPayload) =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  googleLogin: (payload: GoogleLoginPayload) =>
    request<AuthResponse>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () =>
    request<AuthUser>('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }),

  changePassword: (payload: ChangePasswordPayload) =>
    request<MessageResponse>('/api/auth/change-password', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    }),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    request<MessageResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyResetCode: (payload: VerifyResetCodePayload) =>
    request<MessageResponse>('/api/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    request<MessageResponse>('/api/auth/forgot-password/reset', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
