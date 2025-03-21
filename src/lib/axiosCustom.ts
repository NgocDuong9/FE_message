import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

import { ACCESS_TOKEN_KEY, USER_KEY } from "@/constants/localStorage";

class Axios {
  private instance: AxiosInstance;
  private interceptor: number | null = null;

  constructor() {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    // Response interceptor
    const interceptor = instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
        return Promise.reject(error.response);
      }
    );

    instance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (accessToken && config.headers) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error.response);
      }
    );

    this.interceptor = interceptor;
    this.instance = instance;
  }

  public get Instance(): AxiosInstance {
    return this.instance;
  }

  private useInterceptor() {
    if (this.interceptor === null) {
      const interceptor = this.instance.interceptors.response.use(
        (response: AxiosResponse) => response.data,
        (error: AxiosError) => Promise.reject(error.response)
      );
      this.interceptor = interceptor;
    }
  }

  private ejectInterceptor() {
    if (this.interceptor !== null) {
      this.instance.interceptors.response.eject(this.interceptor);
      this.interceptor = null;
    }
  }

  // Create
  public post<T, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.useInterceptor();
    return this.Instance.post<T, R>(url, data, config);
  }

  // Read
  public get<T, R = T>(url: string, config?: AxiosRequestConfig): Promise<R> {
    this.useInterceptor();
    return this.Instance.get<T, R>(url, config);
  }

  // Update
  public put<T, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.useInterceptor();
    return this.Instance.put<T, R>(url, data, config);
  }

  // Delete
  public delete<T, R = T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.useInterceptor();
    return this.Instance.delete<T, R>(url, config);
  }

  // Post with full response
  public pull<T, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.ejectInterceptor();
    return this.Instance.post<T, R>(url, data, config);
  }
}

const axiosInstance = new Axios();

export default axiosInstance;
