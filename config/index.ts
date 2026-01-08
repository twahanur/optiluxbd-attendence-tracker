const DEFAULT_BASE_API = "http://localhost:5000/api/v1";

export const config = {
  next_public_base_api: process.env.NEXT_PUBLIC_BASE_API || DEFAULT_BASE_API,
};
