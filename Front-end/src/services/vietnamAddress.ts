export type VnWard = {
  name: string;
  code: number;
  district_code: number;
};

export type VnDistrict = {
  name: string;
  code: number;
  province_code: number;
  wards: VnWard[];
};

export type VnProvince = {
  name: string;
  code: number;
  districts: VnDistrict[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function fetchProvinces(): Promise<VnProvince[]> {
  const response = await fetch(`${API_BASE_URL}/api/address/provinces`);
  if (!response.ok) throw new Error('Không tải được danh sách địa chỉ.');
  const data = await response.json();
  return data.provinces || [];
}
