import React from 'react';
import { usePropertyStore } from '../../store/propertyStore';
import { MapPin, Home, Trash2 } from 'lucide-react';

export const ListPage: React.FC = () => {
  const { properties, removeProperty, fetchProperties, loading } = usePropertyStore();

  React.useEffect(() => {
    fetchProperties();
  }, []);

  if (loading && properties.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400">
        加载中...
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <Home size={48} className="mb-4 text-gray-300" />
        <p>暂无看房记录</p>
        <p className="text-xs mt-2">点击下方 "+" 按钮开始录入</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex justify-between items-center px-2">
         <h2 className="text-lg font-bold text-gray-800">我的看房记录 ({properties.length})</h2>
      </div>

      <div className="space-y-3">
        {properties.map(property => (
          <div key={property.id} className="bg-white p-3 rounded-xl shadow-sm flex gap-3 relative overflow-hidden group">
            
            {/* Image Placeholder or First Image */}
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
              {property.decorationImages && property.decorationImages.length > 0 ? (
                <img src={property.decorationImages[0]} alt="room" className="w-full h-full object-cover" />
              ) : (
                <span>暂无图片</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-1 text-base">{property.address}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span className="mr-2">{property.administrativeDistrict} {property.plate}</span>
                  <span className="mr-2">{property.floor}</span>
                  <span>{property.age}年</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                   <span>{property.decoration}</span>
                   <span className="mx-1">|</span>
                   <span>{property.area}㎡</span>
                </div>
              </div>

              {/* Facilities (formerly Tags) */}
              <div className="flex gap-1 mt-1 overflow-hidden flex-wrap h-5">
                {property.facilities && property.facilities.slice(0, 3).map((fac, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] rounded whitespace-nowrap">
                    {fac.name}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-red-600 font-bold text-lg">{property.totalPrice}<span className="text-xs">万</span></span>
                <span className="text-gray-400 text-xs">{property.unitPrice}元/㎡</span>
              </div>
            </div>

            {/* Delete Action */}
            <button 
              onClick={() => removeProperty(property.id)}
              className="absolute right-3 top-3 text-gray-300 hover:text-red-500 p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
