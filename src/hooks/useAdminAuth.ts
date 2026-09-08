import { useState, useEffect } from 'react';

const STORAGE_AUTH_KEY = 'sony_fe_admin_authenticated';
const STORAGE_PASSCODE_KEY = 'sony_fe_admin_passcode';
const DEFAULT_PASSCODE = 'sony-fe-2026';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_AUTH_KEY) === 'true';
  });

  const getStoredPasscode = (): string => {
    return localStorage.getItem(STORAGE_PASSCODE_KEY) || DEFAULT_PASSCODE;
  };

  const login = (passcode: string): boolean => {
    const currentPasscode = getStoredPasscode();
    if (passcode.trim() === currentPasscode) {
      localStorage.setItem(STORAGE_AUTH_KEY, 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_AUTH_KEY);
    setIsAdmin(false);
  };

  const changePasscode = (oldPasscode: string, newPasscode: string): { success: boolean; message: string } => {
    const currentPasscode = getStoredPasscode();
    if (oldPasscode.trim() !== currentPasscode) {
      return { success: false, message: '原管理员密钥错误' };
    }
    if (!newPasscode || newPasscode.trim().length < 6) {
      return { success: false, message: '新密钥长度至少为 6 位' };
    }
    localStorage.setItem(STORAGE_PASSCODE_KEY, newPasscode.trim());
    return { success: true, message: '管理密钥修改成功' };
  };

  return {
    isAdmin,
    login,
    logout,
    changePasscode,
  };
}
