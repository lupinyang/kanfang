import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, UserCog, UserCheck, UserX } from 'lucide-react';

const demoUsers = [
  {
    username: 'lupinylj',
    role: '管理员',
    status: '启用',
    scope: '录入、列表、后台、用户设置',
  },
  {
    username: 'demo_user_01',
    role: '普通用户',
    status: '启用',
    scope: '录入、列表',
  },
  {
    username: 'demo_user_02',
    role: '普通用户',
    status: '停用',
    scope: '不可登录',
  },
];

export const UserSettingsDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-900 p-2 text-white">
            <UserCog size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">用户设置</h1>
            <p className="text-sm text-gray-500">Demo 原型，仅用于确认管理逻辑与页面结构</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            返回后台
          </Link>
          <Link
            to="/login-demo"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            查看登录 Demo
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">可登录账号数</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">2</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">管理员账号</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">1</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">停用账号</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">1</p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">登录与权限规划</h2>
              <p className="mt-1 text-sm text-gray-500">
                后续在这里维护哪些用户允许登录，以及每个用户能访问哪些菜单。
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              新增用户
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">用户名</th>
                  <th className="px-6 py-4 font-medium">角色</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium">可访问菜单</th>
                  <th className="px-6 py-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {demoUsers.map((user) => (
                  <tr key={user.username} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                        <Shield size={14} />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.status === '启用' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-green-700">
                          <UserCheck size={14} />
                          启用
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-red-700">
                          <UserX size={14} />
                          停用
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.scope}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          重置密码
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-dashed border-blue-200 bg-blue-50 p-6">
          <h3 className="text-base font-bold text-gray-900">拟定管理规则</h3>
          <div className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
            <p>1. 将当前“系统设置”入口改为“用户设置”，只允许管理员访问。</p>
            <p>2. 普通用户登录后只能访问录入页和列表页，不能进入后台。</p>
            <p>3. 管理员可新增用户、停用用户、修改密码、配置菜单访问权限。</p>
            <p>4. 首版账号密码可先存放在本地配置或数据库表中，管理员默认账号固定。</p>
          </div>
        </section>
      </div>
    </div>
  );
};
