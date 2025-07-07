import { Response } from "express";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  pagination?: PaginationMeta
) {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(pagination && { pagination }),
  };

  return res.status(statusCode).json(response);
}

export function sendErrorResponse(
  res: Response,
  message: string,
  errors?: any,
  statusCode = 500
) {
  const response: ErrorResponse = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}
