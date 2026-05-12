import React from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole, User, ShieldCheck } from 'lucide-react';

export const LoginDemoPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-blue-100">Demo 原型</p>
            <h2 className="mt-1 text-2xl font-bold">账号登录</h2>
            <p className="mt-2 text-sm leading-6 text-blue-50">
              后续用户需要先登录，才能进入录入、列表和后台功能。
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <ShieldCheck size={28} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">用户名</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                value="lupinylj"
                readOnly
                className="w-full bg-transparent text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">密码</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <LockKeyhole size={18} className="text-gray-400" />
              <input
                type="password"
                value="linshi999"
                readOnly
                className="w-full bg-transparent text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            登录
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-gray-700">
        <p className="font-medium text-gray-900">规划中的登录规则</p>
        <ul className="mt-2 space-y-2 text-sm leading-6">
          <li>1. 未登录时默认进入登录页，不能直接访问录入、列表、后台页面。</li>
          <li>2. 登录成功后写入本地登录状态，后续打开小程序自动保持登录。</li>
          <li>3. 当前阶段仅支持用户名 + 密码，不做双因子认证、不做找回密码。</li>
          <li>4. 管理员账号固定为 `lupinylj`，用于进入后台的用户设置页面。</li>
        </ul>
      </section>

      <div className="flex gap-3">
        <Link
          to="/"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700"
        >
          返回录入页
        </Link>
        <Link
          to="/admin/users-demo"
          className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white"
        >
          查看用户设置 Demo
        </Link>
      </div>
    </div>
  );
};
