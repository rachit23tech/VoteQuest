'use client';

import axios, { AxiosInstance } from 'axios';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useApi = () => {
  const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests if available
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const register = useCallback(
    async (username: string, email: string, password: string, state?: string) => {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        state,
      });
      return response.data;
    },
    [api]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      
      const response = await api.post('/api/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    },
    [api]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    return { message: 'Successfully logged out' };
  }, []);

  const getCurrentUser = useCallback(async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  }, [api]);

  const startGame = useCallback(
    async (state: string) => {
      const response = await api.post(`/api/game/start?state=${encodeURIComponent(state)}`);
      return response.data;
    },
    [api]
  );

  const submitLevel = useCallback(
    async (levelId: number, answers: Array<any>, timeTaken: number) => {
      const response = await api.post('/api/game/level/' + levelId + '/submit', {
        level: levelId,
        answers,
        time_taken: timeTaken,
      });
      return response.data;
    },
    [api]
  );

  const getLeaderboard = useCallback(async (limit: number = 10) => {
    const response = await api.get('/api/leaderboard', { params: { limit } });
    return response.data;
  }, [api]);

  const getStateData = useCallback(async (stateCode: string) => {
    const response = await api.get(`/api/states/${stateCode}`);
    return response.data;
  }, [api]);

  const getUserStats = useCallback(async () => {
    const response = await api.get('/api/game/stats');
    return response.data;
  }, [api]);

  const getAchievements = useCallback(async () => {
    const response = await api.get('/api/game/achievements');
    return response.data;
  }, [api]);

  const chatWithTutor = useCallback(async (message: string, history: any[] = []) => {
    const response = await api.post('/api/chat', { message, history });
    return response.data;
  }, [api]);

  return {
    api,
    register,
    login,
    logout,
    getCurrentUser,
    startGame,
    submitLevel,
    getLeaderboard,
    getStateData,
    getUserStats,
    getAchievements,
    chatWithTutor,
  };
};
