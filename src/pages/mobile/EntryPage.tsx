import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyStore, Facility } from '../../store/propertyStore';
import { clsx } from 'clsx';
import { Save, Plus, Trash2, Camera, MapPin, Train, Stethoscope, GraduationCap, ShoppingBag } from 'lucide-react';

const SHANGHAI_DISTRICTS = [
  '浦东新区', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', 
  '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '金山区', 
  '松江区', '青浦区', '奉贤区', '崇明区'
];

// Mock plates for demo purposes
const MOCK_PLATES: Record<string, string[]> = {
  '黄浦区': ['外滩', '南京东路', '人民广场', '淮海中路', '豫园', '老西门', '打浦桥', '五里桥', '黄浦滨江', '董家渡', '世博滨江'],
  '静安区': ['南京西路', '静安寺', '曹家渡', '大宁', '彭浦新村', '永和', '不夜城', '西藏北路', '新客站', '市北高新'],
  '徐汇区': ['徐家汇', '衡山路', '建国西路', '斜土路', '田林', '康健', '长桥', '龙华', '上海南站', '华泾', '徐汇滨江', '漕河泾', '万体馆'],
  '长宁区': ['新华路', '镇宁路', '中山公园', '天山', '古北', '仙霞', '北新泾', '西郊', '虹桥开发区', '程家桥', '新泾'],
  '普陀区': ['长寿路', '武宁', '曹杨', '长风', '真如', '万里', '甘泉宜川', '光新', '桃浦', '真光', '李子园', '长征', '中远两湾城'],
  '虹口区': ['北外滩', '四川北路', '提篮桥', '临平路', '曲阳', '凉城', '江湾镇', '大柏树', '广中路', '欧阳路'],
  '杨浦区': ['东外滩', '杨浦滨江', '五角场', '新江湾城', '中原', '鞍山', '控江路', '平凉路', '长阳路', '黄兴', '定海', '殷行', '黄兴公园'],
  '浦东新区': ['陆家嘴', '潍坊新村', '塘桥', '源深', '洋泾', '花木', '联洋', '碧云', '金桥', '金杨', '张江', '北蔡', '御桥', '康桥', '周浦', '航头', '新场', '宣桥', '惠南', '祝桥', '临港新城', '泥城', '书院', '万祥', '老港', '唐镇', '曹路', '高行', '高东', '三林', '世博', '前滩', '浦江镇', '川沙', '合庆', '外高桥'],
  '闵行区': ['莘庄', '七宝', '古美', '梅陇', '春申', '颛桥', '马桥', '吴泾', '华漕', '江川路', '金虹桥', '浦江', '紫竹高新区', '老闵行', '龙柏', '航华', '静安新城', '罗阳'],
  '宝山区': ['淞宝', '淞南', '高境', '大华', '大场', '上大', '顾村', '共康', '杨行', '月浦', '罗店', '罗泾', '吴淞', '张庙', '通河', '共富'],
  '嘉定区': ['嘉定新城', '安亭', '南翔', '江桥', '真新', '马陆', '菊园新区', '徐行', '外冈', '华亭', '嘉定城区'],
  '松江区': ['松江新城', '泗泾', '九亭', '佘山', '洞泾', '新桥', '车墩', '永丰', '岳阳', '方松', '小昆山', '石湖荡', '新浜', '泖港', '叶榭', '松江大学城', '松江老城'],
  '青浦区': ['青浦新城', '徐泾', '赵巷', '华新', '重固', '白鹤', '朱家角', '练塘', '金泽', '夏阳', '盈浦', '香花桥'],
  '奉贤区': ['南桥新城', '奉城', '四团', '柘林', '庄行', '金汇', '青村', '海湾', '西渡', '奉浦', '金海', '头桥'],
  '金山区': ['金山新城', '朱泾', '枫泾', '张堰', '亭林', '漕泾', '山阳', '金山卫', '吕巷', '廊下'],
  '崇明区': ['城桥', '堡镇', '陈家镇', '长兴岛', '横沙岛', '新河镇', '庙镇', '竖新镇', '向化镇', '三星镇', '港沿镇', '中兴镇', '绿华镇', '港西镇', '建设镇', '新海镇', '东平']
};

const DECORATION_OPTIONS = ['毛坯', '简装', '精装', '豪装'];

const FACILITY_TYPES = [
  { type: 'subway', label: '地铁', icon: Train, placeholder: '几号线', unit: '米' },
  { type: 'medical', label: '医疗', icon: Stethoscope, placeholder: '医院名称', unit: '米' },
  { type: 'school', label: '学区', icon: GraduationCap, placeholder: '学校名称', unit: null }, // School might not need distance as much as name
  { type: 'business', label: '商圈', icon: ShoppingBag, placeholder: '商圈名称', unit: '米' },
] as const;

export const EntryPage: React.FC = () => {
  const navigate = useNavigate();
  const addProperty = usePropertyStore((state) => state.addProperty);

  const [formData, setFormData] = useState({
    administrativeDistrict: '',
    plate: '',
    address: '',
    floor: '',
    area: '',
    age: '',
    totalPrice: '',
    estimatedRent: '',
    decoration: '精装' as const,
  });

  const [decorationImages, setDecorationImages] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  // Computed Unit Price & Rental Yield
  const { unitPrice, rentalYield } = useMemo(() => {
    const price = parseFloat(formData.totalPrice);
    const area = parseFloat(formData.area);
    const rent = parseFloat(formData.estimatedRent);
    
    let uPrice = 0;
    let rYield = 0;

    if (price && area) {
      uPrice = Math.round((price * 10000) / area);
    }

    if (price && rent) {
      // Rental Yield = (Monthly Rent * 12) / (Total Price * 10000) * 100%
      rYield = (rent * 12) / (price * 10000) * 100;
    }

    return { unitPrice: uPrice, rentalYield: rYield };
  }, [formData.totalPrice, formData.area, formData.estimatedRent]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDecorationImages([...decorationImages, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setDecorationImages(decorationImages.filter((_, i) => i !== index));
  };

  const addFacility = (type: Facility['type']) => {
    setFacilities([...facilities, { type, name: '', distance: '' }]);
  };

  const updateFacility = (index: number, field: keyof Facility, value: string) => {
    const newFacilities = [...facilities];
    newFacilities[index] = { ...newFacilities[index], [field]: value };
    setFacilities(newFacilities);
  };

  const removeFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.administrativeDistrict || !formData.address || !formData.totalPrice) {
      alert('请填写完整基本信息');
      return;
    }

    // Check for duplicates in store (client-side check for immediate feedback)
    const isDuplicate = usePropertyStore.getState().properties.some(p => 
      p.administrativeDistrict === formData.administrativeDistrict &&
      p.address === formData.address &&
      p.floor === formData.floor
    );

    if (isDuplicate) {
      alert('该房源已存在，请勿重复录入');
      return;
    }

    setIsSubmitting(true);
    try {
      // Need to await the async action
      await addProperty({
        administrativeDistrict: formData.administrativeDistrict,
        plate: formData.plate,
        address: formData.address,
        floor: formData.floor,
        area: Number(formData.area),
        age: Number(formData.age),
        totalPrice: Number(formData.totalPrice),
        estimatedRent: Number(formData.estimatedRent),
        decoration: formData.decoration as any,
        decorationImages,
        facilities,
      });
      navigate('/list');
    } catch (error) {
      console.error('Submit failed', error);
      alert('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availablePlates = formData.administrativeDistrict ? (MOCK_PLATES[formData.administrativeDistrict] || []) : [];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 text-center">看房录入</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        
        {/* Location Section */}
        <section className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-semibold border-b pb-2">
            <MapPin size={18} />
            <h3>位置信息</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">行政区</label>
              <select 
                className="w-full p-2 bg-gray-50 rounded-lg text-sm outline-none border border-gray-100 focus:border-blue-500"
                value={formData.administrativeDistrict}
                onChange={e => setFormData({...formData, administrativeDistrict: e.target.value, plate: ''})}
              >
                <option value="">请选择区域</option>
                {SHANGHAI_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
               <label className="block text-xs text-gray-500 mb-1">板块</label>
               {availablePlates.length > 0 ? (
                 <select
                    className="w-full p-2 bg-gray-50 rounded-lg text-sm outline-none border border-gray-100 focus:border-blue-500"
                    value={formData.plate}
                    onChange={e => setFormData({...formData, plate: e.target.value})}
                 >
                   <option value="">请选择板块</option>
                   {availablePlates.map(p => (
                     <option key={p} value={p}>{p}</option>
                   ))}
                 </select>
               ) : (
                 <input 
                   type="text" 
                   placeholder="请输入板块"
                   className="w-full p-2 bg-gray-50 rounded-lg text-sm outline-none border border-gray-100 focus:border-blue-500"
                   value={formData.plate}
                   onChange={e => setFormData({...formData, plate: e.target.value})}
                 />
               )}
            </div>
          </div>

          <div>
             <label className="block text-xs text-gray-500 mb-1">小区 / 详细地址</label>
             <textarea 
               rows={2}
               placeholder="例如：浦东新区 花木路1883弄 御翠园 88号101室"
               className="w-full p-3 bg-gray-50 rounded-lg text-sm outline-none border border-gray-100 focus:border-blue-500 resize-none"
               value={formData.address}
               onChange={e => setFormData({...formData, address: e.target.value})}
             />
          </div>
        </section>

        {/* Basic Info */}
        <section className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold border-b pb-2">
            <span>🏠 房源详情</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">面积 (㎡)</label>
              <input type="number" inputMode="decimal" className="input-field w-full p-2 bg-gray-50 rounded-lg"
                value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">楼层</label>
              <input type="text" placeholder="如 5/20" className="input-field w-full p-2 bg-gray-50 rounded-lg"
                value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">房龄 (年份)</label>
              <input 
                type="number" 
                placeholder="如 2005"
                min="1900"
                max={new Date().getFullYear()}
                className="input-field w-full p-2 bg-gray-50 rounded-lg"
                value={formData.age} 
                onChange={e => {
                  const val = e.target.value;
                  // Allow empty or up to 4 digits
                  if (val === '' || (val.length <= 4)) {
                     setFormData({...formData, age: val});
                  }
                }}
                onBlur={e => {
                  const val = parseInt(e.target.value);
                  if (val && (val < 1900 || val > new Date().getFullYear())) {
                    alert('请输入有效的年份 (1900-至今)');
                    setFormData({...formData, age: ''});
                  }
                }}
              />
            </div>
          </div>

          {/* Decoration & Photos */}
          <div>
             <label className="block text-xs text-gray-500 mb-1">装修状况</label>
             <div className="flex bg-gray-50 rounded-lg p-1 mb-3">
               {DECORATION_OPTIONS.map(opt => (
                 <button
                   key={opt}
                   type="button"
                   onClick={() => setFormData({...formData, decoration: opt as any})}
                   className={clsx(
                     "flex-1 text-xs py-2 rounded-md transition-all",
                     formData.decoration === opt ? "bg-white shadow text-blue-600 font-medium" : "text-gray-400"
                   )}
                 >
                   {opt}
                 </button>
               ))}
             </div>
             
             {/* Photo Upload */}
             <div className="grid grid-cols-4 gap-2">
                {decorationImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} alt="decoration" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors">
                  <Camera size={24} />
                  <span className="text-[10px] mt-1">添加照片</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
             </div>
          </div>
        </section>

        {/* Price Section */}
        <section className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-orange-600 font-semibold border-b pb-2">
            <span>💰 价格分析</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">总价 (万元)</label>
              <div className="relative">
                <input type="number" inputMode="decimal" className="w-full p-2 bg-gray-50 rounded-lg text-lg font-bold text-orange-600 outline-none"
                  value={formData.totalPrice} onChange={e => setFormData({...formData, totalPrice: e.target.value})} />
                <span className="absolute right-3 top-3 text-xs text-gray-400">万</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">参考单价</label>
              <div className="w-full p-2.5 bg-orange-50 rounded-lg text-orange-600 font-bold">
                 {unitPrice > 0 ? unitPrice.toLocaleString() : '-'} <span className="text-xs font-normal">元/㎡</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">预计租金 (元/月)</label>
            <div className="flex gap-3">
              <input 
                type="number" 
                inputMode="numeric" 
                className="flex-1 p-2 bg-gray-50 rounded-lg text-sm outline-none border border-gray-100 focus:border-blue-500"
                value={formData.estimatedRent} 
                onChange={e => setFormData({...formData, estimatedRent: e.target.value})} 
              />
              <div className="flex-1 p-2 bg-blue-50 rounded-lg flex items-center justify-between px-3">
                 <span className="text-xs text-blue-600">租售比</span>
                 <span className="font-bold text-blue-700">
                   {rentalYield > 0 ? rentalYield.toFixed(2) : '-'} <span className="text-xs font-normal">%</span>
                 </span>
              </div>
            </div>
          </div>
        </section>

        {/* Surrounding Facilities */}
        <section className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-green-600 font-semibold border-b pb-2">
            <span>🌳 周边配套</span>
          </div>
          
          <div className="space-y-4">
            {FACILITY_TYPES.map((fType) => {
              const items = facilities.filter(f => f.type === fType.type);
              return (
                <div key={fType.type} className="space-y-2">
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2 text-sm text-gray-700">
                       <fType.icon size={16} />
                       <span>{fType.label}</span>
                     </div>
                     <button 
                       type="button" 
                       onClick={() => addFacility(fType.type as any)}
                       className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-blue-100"
                     >
                       <Plus size={12} /> 添加
                     </button>
                   </div>
                   
                   {items.length > 0 && (
                     <div className="space-y-2">
                       {facilities.map((f, idx) => {
                         if (f.type !== fType.type) return null;
                         return (
                           <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg animate-in fade-in zoom-in duration-200">
                             <input 
                               placeholder={fType.placeholder}
                               className="flex-1 bg-transparent text-sm outline-none min-w-0"
                               value={f.name}
                               onChange={e => updateFacility(idx, 'name', e.target.value)}
                             />
                             {fType.unit && (
                               <div className="flex items-center gap-1 border-l pl-2 w-20 shrink-0">
                                 <input 
                                   placeholder="距离"
                                   type="number"
                                   className="w-full bg-transparent text-sm outline-none text-right"
                                   value={f.distance}
                                   onChange={e => updateFacility(idx, 'distance', e.target.value)}
                                 />
                                 <span className="text-xs text-gray-400">{fType.unit}</span>
                               </div>
                             )}
                             <button type="button" onClick={() => removeFacility(idx)} className="text-gray-400 hover:text-red-500 px-1">
                               <Trash2 size={14} />
                             </button>
                           </div>
                         );
                       })}
                     </div>
                   )}
                </div>
              );
            })}
          </div>
        </section>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            "w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-4",
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 shadow-blue-200 active:scale-95"
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save size={20} />
              保存房源信息
            </>
          )}
        </button>
      </form>
    </div>
  );
};
