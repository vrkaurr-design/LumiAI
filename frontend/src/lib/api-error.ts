export type ApiError = {
  status?: number;
  message: string;
  details?: unknown;
};

export const normalizeApiError = (error: any): ApiError => {
  const status = error?.response?.status;
  const responseData = error?.response?.data;
  const message =
    responseData?.message ||
    error?.message ||
    'Request failed';
  const details = responseData?.details ?? responseData;
  return { status, message, details };
};
