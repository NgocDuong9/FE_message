import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '@/constants/localStorage';

class Axios {
  private instance: AxiosInstance;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: { 'Content-Type': 'application/json' },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // Request interceptor - Thêm token vào header
    this.instance.interceptors.request.use(
      config => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken && config.headers) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor - Xử lý refresh token
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Kiểm tra nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          return this.handleRefreshToken(originalRequest);
        }

        return Promise.reject(error.response);
      }
    );
  }

  private async handleRefreshToken(originalRequest: AxiosRequestConfig) {
    if (this.isRefreshing) {
      // Nếu đang refresh thì thêm request vào hàng đợi
      return new Promise(resolve => {
        this.refreshSubscribers.push(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          resolve(this.instance(originalRequest));
        });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token available');

      // Gọi API refresh token
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        refreshToken,
      });

      // Lưu token mới
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

      // Cập nhật token trong header mặc định
      this.instance.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;

      // Thực thi các request trong hàng đợi
      this.refreshSubscribers.forEach(callback => callback(data.accessToken));
      this.refreshSubscribers = [];

      return this.instance(originalRequest);
    } catch (refreshError) {
      // Xóa token và chuyển về trang login nếu refresh thất bại
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  public get<T, R = T>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.get<T, R>(url, config);
  }

  public post<T, R = T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.post<T, R>(url, data, config);
  }

  public put<T, R = T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.put<T, R>(url, data, config);
  }

  public patch<T, R = T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.patch<T, R>(url, data, config);
  }

  public delete<T, R = T>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.delete<T, R>(url, config);
  }
}

const axiosInstance = new Axios();

export default axiosInstance;
