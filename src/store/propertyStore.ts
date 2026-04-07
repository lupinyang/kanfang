import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Facility {
  id?: string;
  type: 'subway' | 'medical' | 'school' | 'business';
  name: string; 
  distance?: string; 
}

export interface Property {
  id: string;
  administrativeDistrict: string;
  plate: string;
  address: string;
  floor: string;
  area: number;
  age: number;
  totalPrice: number;
  unitPrice: number;
  estimatedRent: number;
  decoration: '毛坯' | '简装' | '精装' | '豪装';
  decorationImages: string[]; 
  facilities: Facility[];
  createdAt: string;
}

interface PropertyStore {
  properties: Property[];
  loading: boolean;
  fetchProperties: () => Promise<void>;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'unitPrice'>) => Promise<void>;
  removeProperty: (id: string) => Promise<void>;
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: [],
  loading: false,

  fetchProperties: async () => {
    set({ loading: true });
    try {
      const { data: propertiesData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propError) throw propError;

      // Fetch facilities for all properties
      // In a real app with pagination, we might do this differently or use a join
      const { data: facilitiesData, error: facError } = await supabase
        .from('property_facilities')
        .select('*');

      if (facError) throw facError;

      const mergedProperties: Property[] = propertiesData.map((p: any) => ({
        id: p.id,
        administrativeDistrict: p.administrative_district,
        plate: p.plate,
        address: p.address,
        floor: p.floor,
        area: p.area,
        age: p.age,
        totalPrice: p.total_price,
        unitPrice: p.unit_price,
        estimatedRent: p.estimated_rent,
        decoration: p.decoration,
        decorationImages: p.decoration_images || [],
        createdAt: p.created_at,
        facilities: facilitiesData
          .filter((f: any) => f.property_id === p.id)
          .map((f: any) => ({
            id: f.id,
            type: f.type,
            name: f.name,
            distance: f.distance
          }))
      }));

      set({ properties: mergedProperties });
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert('加载房源失败');
    } finally {
      set({ loading: false });
    }
  },

  addProperty: async (data) => {
    set({ loading: true });
    const unitPrice = data.area > 0 ? Math.round(data.totalPrice / data.area * 10000) : 0;
    
    try {
      // 1. Insert Property
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .insert({
          administrative_district: data.administrativeDistrict,
          plate: data.plate,
          address: data.address,
          floor: data.floor,
          area: data.area,
          age: data.age,
          total_price: data.totalPrice,
          unit_price: unitPrice,
          estimated_rent: data.estimatedRent,
          decoration: data.decoration,
          decoration_images: data.decorationImages
        })
        .select()
        .single();

      if (propError) throw propError;
      if (!propData) throw new Error('No data returned');

      // 2. Insert Facilities if any
      if (data.facilities.length > 0) {
        const facilitiesToInsert = data.facilities.map(f => ({
          property_id: propData.id,
          type: f.type,
          name: f.name,
          distance: f.distance
        }));

        const { error: facError } = await supabase
          .from('property_facilities')
          .insert(facilitiesToInsert);
        
        if (facError) throw facError;
      }

      // 3. Refresh list
      await get().fetchProperties();

    } catch (error) {
      console.error('Error adding property:', error);
      alert('保存房源失败');
    } finally {
      set({ loading: false });
    }
  },

  removeProperty: async (id) => {
    if (!window.confirm('确定删除这条记录吗？')) return;
    
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        properties: state.properties.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('删除失败');
    } finally {
      set({ loading: false });
    }
  },
}));
