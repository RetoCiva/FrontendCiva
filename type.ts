export type Brand = { id: number; name: string };

export type Bus = {
  id: number;
  busNumber: number;
  characteristic: string;
  plate: string;
  model: string;
  brand: Brand;
  status: 'active' | 'inactive';
};

export type SignUpRequest = { username: string; password: string };
export type SignInRequest = { username: string; password: string };
export type AuthResponse = { token: string; tokenType?: string; expiresAt?: string };

export type CreateBusRequest = {
  busNumber: string;
  characteristic: string;
  plate: string;
  model: string;
  brandId: number;
  // si creas el bus con estado desde el front:
  // status?: 0 | 1;
};
