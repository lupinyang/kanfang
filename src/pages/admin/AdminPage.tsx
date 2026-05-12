import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePropertyStore } from '../../store/propertyStore';
import { Download, Smartphone, TrendingUp, Home, Map } from 'lucide-react';

import * as XLSX from 'xlsx';

export const AdminPage: React.FC = () => {
  const { properties, fetchProperties, loading } = usePropertyStore();

  React.useEffect(() => {
    fetchProperties();
  }, []);

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProperties = useMemo(() => {
    if (!searchTerm.trim()) return properties;
    const lowerTerm = searchTerm.toLowerCase();
    return properties.filter(p => 
      p.address.toLowerCase().includes(lowerTerm) || 
      p.administrativeDistrict.includes(lowerTerm) ||
      (p.plate && p.plate.includes(lowerTerm))
    );
  }, [properties, searchTerm]);

  const stats = useMemo(() => {
    const total = properties.length;
    const avgPrice = total > 0 
      ? Math.round(properties.reduce((sum, p) => sum + p.totalPrice, 0) / total) 
      : 0;
    const avgUnitPrice = total > 0 
      ? Math.round(properties.reduce((sum, p) => sum + p.unitPrice, 0) / total) 
      : 0;
    return { total, avgPrice, avgUnitPrice };
  }, [properties]);

  const handleExport = () => {
    if (properties.length === 0) {
      alert('暂无数据可导出');
      return;
    }

    // Format data for Excel
    const data = properties.map(p => {
      // Flatten facilities
      const facilityStr = p.facilities
        .map(f => `${f.name}${f.distance ? `(${f.distance}米)` : ''}`)
        .join(', ');

      // Calculate rental yield
      let rentalYield = '0.00%';
      if (p.totalPrice && p.estimatedRent) {
         rentalYield = ((p.estimatedRent * 12) / (p.totalPrice * 10000) * 100).toFixed(2) + '%';
      }

      return {
        '行政区': p.administrativeDistrict,
        '板块': p.plate || '-',
        '小区/地址': p.address,
        '楼层': p.floor,
        '面积(㎡)': p.area,
        '房龄(年)': p.age,
        '装修': p.decoration,
        '总价(万元)': p.totalPrice,
        '单价(元/㎡)': p.unitPrice,
        '预计租金(元/月)': p.estimatedRent || '-',
        '租售比': rentalYield,
        '周边配套': facilityStr,
        '录入时间': new Date(p.createdAt).toLocaleString(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '看房记录');
    
    // Generate filename with timestamp
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `看房记录_${dateStr}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">看房决策分析台</h1>
        </div>
        <div className="flex gap-4">
           <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
             <Smartphone size={18} />
             <span>打开小程序录入端</span>
           </Link>
           <Link
             to="/admin/users-demo"
             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
           >
             用户设置
           </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">已看房源总数</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.total} <span className="text-sm font-normal text-gray-400">套</span></h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Home size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">平均总价</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.avgPrice} <span className="text-sm font-normal text-gray-400">万</span></h3>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">平均单价</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.avgUnitPrice.toLocaleString()} <span className="text-sm font-normal text-gray-400">元/㎡</span></h3>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <Map size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">房源明细表</h2>
            <div className="flex gap-3">
               <input 
                 type="text" 
                 placeholder="搜索小区、区域或板块..." 
                 className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
               <button 
                 onClick={handleExport}
                 className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
               >
                 <Download size={16} />
                 导出Excel
               </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">区域/板块</th>
                  <th className="px-6 py-4 font-medium">小区/地址</th>
                  <th className="px-6 py-4 font-medium">总价 (万)</th>
                  <th className="px-6 py-4 font-medium">单价 (元/㎡)</th>
                  <th className="px-6 py-4 font-medium">面积 (㎡)</th>
                  <th className="px-6 py-4 font-medium">房龄</th>
                  <th className="px-6 py-4 font-medium">配套</th>
                  <th className="px-6 py-4 font-medium">录入时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                      {properties.length === 0 ? "暂无数据，请前往小程序端录入" : "没有找到匹配的房源"}
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.administrativeDistrict}
                        <span className="text-xs text-gray-400 ml-1">({item.plate || '-'})</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.address}</td>
                      <td className="px-6 py-4 text-sm text-orange-600 font-bold">{item.totalPrice}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.unitPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.area}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.age}年</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {item.facilities && item.facilities.slice(0, 2).map((f, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{f.name}</span>
                          ))}
                          {item.facilities && item.facilities.length > 2 && <span className="text-xs text-gray-400">+{item.facilities.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <span className="text-xs text-gray-500">
              共 {filteredProperties.length} 条记录 
              {properties.length !== filteredProperties.length && ` (总计 ${properties.length} 条)`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
