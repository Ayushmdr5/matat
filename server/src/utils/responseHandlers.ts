// utils/responseHandlers.ts

import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
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
  statusCode = 200
) {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };
  if (message) response.message = message;
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
