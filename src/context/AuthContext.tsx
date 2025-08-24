/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import authService from "@/app/(auth)/services";
import { TUser } from "@/types/User.types";
import React, { useContext, useEffect, useReducer } from "react";

interface AuthState {
  user: TUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | {
      type: "PENDING";
    }
  | {
      type: "SUCCESS";
      payload?: TUser | null;
    }
  | { type: "GET_USER_SUCCESS"; payload?: TUser | null }
  | {
      type: "LOGOUT";
    }
  | {
      type: "FAILURE";
      payload?: {
        error: string | null;
      };
    };

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "PENDING":
      return {
        ...state,
        loading: true,
      };
    case "SUCCESS":
      return {
        ...state,
        user: action.payload || null,
        loading: false,
        isAuthenticated: !!action.payload,
      };

    case "GET_USER_SUCCESS":
      return {
        ...state,
        user: action.payload || null,
        loading: false,
        isAuthenticated: !!action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload?.error || null,
      };
  }
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string | undefined;
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (token) {
      getUser();
    } else {
      createGuestUser();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    dispatch({ type: "PENDING" });
    try {
      const response = await authService.login(email, password);
      dispatch({ type: "SUCCESS", payload: response });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message } });
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    dispatch({ type: "PENDING" });
    try {
      const response = await authService.register(email, password);
      dispatch({ type: "SUCCESS", payload: response });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message } });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: "PENDING" });
    try {
      dispatch({ type: "LOGOUT" });
      await authService.logout();
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message } });
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const response = await authService.getUser();
      dispatch({ type: "GET_USER_SUCCESS", payload: response });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message } });
      throw error;
    }
  };

  const createGuestUser = async () => {
    try {
      const response = await authService.createGuestUser();

      dispatch({ type: "SUCCESS", payload: response });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: { error: error.message } });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
