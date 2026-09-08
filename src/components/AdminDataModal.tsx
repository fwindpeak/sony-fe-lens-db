import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  ShieldCheck,
  Lock,
  Download,
  FileJson,
  FileSpreadsheet,
  Database,
  Key,
  LogOut,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import lensesData from '../data/lenses.json';

interface AdminDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDataModal: React.FC<AdminDataModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isAdmin, login, logout, changePasscode } = useAdminAuth();

  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 修改密码状态
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!inputCode.trim()) {
      setErrorMsg('请输入管理员密钥');
      return;
    }
    const ok = login(inputCode);
    if (ok) {
      setInputCode('');
      setErrorMsg('');
    } else {
      setErrorMsg('密钥错误，无权访问数据库核心导出！');
    }
  };

  const handleLogout = () => {
    logout();
    setIsChangingPass(false);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleChangePass = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const res = changePasscode(oldPass, newPass);
    if (res.success) {
      setSuccessMsg(res.message);
      setOldPass('');
      setNewPass('');
      setIsChangingPass(false);
    } else {
      setErrorMsg(res.message);
    }
  };

  // 授权下载 JSON
  const handleDownloadJSON = () => {
    if (!isAdmin) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lensesData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'sony_fe_lenses_calibrated.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // 授权下载 CSV
  const handleDownloadCSV = () => {
    if (!isAdmin) return;
    const headers = [
      '品牌', '镜头名称', '类型', '焦段', '最大光圈', '对焦', '防抖',
      '综合总分', '锐度均值', '边缘一致性', '全开可用度', '色散控制', '虚化氛围', '畸变暗角',
      '全新参考价', '二手参考价', '香港参考价', '官方指导价', '上市时间', '重量_g', '滤镜口径', '官网链接'
    ];
    const rows = lensesData.map((l) =>
      [
        `"${l.brandZh}"`,
        `"${l.name}"`,
        `"${l.type}"`,
        `"${l.focalDesc}"`,
        `"${l.apertureDesc}"`,
        `"${l.focusType}"`,
        `"${l.ossDesc}"`,
        l.overallScore,
        l.sharpnessScore,
        l.uniformityScore,
        l.wideOpenScore,
        l.caControlScore,
        l.bokehScore,
        l.distortionScore,
        l.priceNew || l.priceCny || '',
        l.priceUsed || '',
        l.priceHk || '',
        l.priceMsrp || '',
        `"${l.releaseDate || ''}"`,
        l.weightG,
        `"${l.filterThread || ''}"`,
        `"${l.officialUrl || ''}"`,
      ].join(',')
    );
    const csvContent = '\ufeff' + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'sony_fe_lenses_calibrated.csv');
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-[#131620] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-slide-up p-6">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${isAdmin
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                }`}
            >
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                {isAdmin ? '数据库管理授权 (已认证)' : '数据资产权限认证'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAdmin ? '可执行数据库导出与资产保护配置' : '数据库受权限保护，防止未经授权的批量导出'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 未认证：登录表单 */}
        {!isAdmin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              为了保障作者耗费大量心血收集与标定的 420+ 款全画幅镜头数据库不被第三方轻易批量抓取或滥用，数据的全量导入导出仅对持有口令的站长或授权管理员开放。
            </div> */}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                管理员密钥 (Admin Passcode)
              </label>
              <input
                type="password"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="请输入管理口令..."
                autoFocus
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>验证并解锁管理权限</span>
            </button>
          </form>
        ) : (
          /* 已认证：管理与导出面板 */
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>身份认证通过：您已获得核心数据访问权限</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 underline transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>退出登录</span>
              </button>
            </div>

            {/* 导出选项 */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                数据库导出操作
              </h4>

              <button
                onClick={handleDownloadJSON}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-500/10 border border-slate-200 dark:border-slate-700/80 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <FileJson className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-orange-500 transition-colors block">
                      导出纯 JSON 核心数据库
                    </span>
                    <span className="text-[11px] text-slate-400">
                      完整 424 款镜头规范结构体 (Single Source of Truth)
                    </span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
              </button>

              <button
                onClick={handleDownloadCSV}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-700/80 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors block">
                      导出全字段 CSV 表格文件
                    </span>
                    <span className="text-[11px] text-slate-400">
                      带 UTF-8 BOM，兼容 Excel / Numbers / 飞书表格打开
                    </span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </button>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                <Database className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                    SQLite 数据库离线使用
                  </span>
                  <span>
                    系统已自动将数据库构建在本地 <code className="text-orange-600 dark:text-orange-400 font-mono">dist/lenses.db</code>，您可通过 DBeaver、Navicat 或 SQLiteStudio 直接查看分析。
                  </span>
                </div>
              </div>
            </div>

            {/* 修改密钥折叠区域 */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {!isChangingPass ? (
                <button
                  onClick={() => setIsChangingPass(true)}
                  className="text-xs text-slate-500 hover:text-orange-500 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>修改管理员安全密钥</span>
                </button>
              ) : (
                <form onSubmit={handleChangePass} className="space-y-2.5 mt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>修改管理员密钥</span>
                    <button
                      type="button"
                      onClick={() => setIsChangingPass(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      取消
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="原管理密钥"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="password"
                    placeholder="新管理密钥 (至少6位)"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  {errorMsg && <p className="text-[11px] text-red-500">{errorMsg}</p>}
                  {successMsg && <p className="text-[11px] text-emerald-500">{successMsg}</p>}
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                  >
                    保存新密钥
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
