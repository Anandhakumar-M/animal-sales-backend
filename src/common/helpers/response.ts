export class ApiResponse {
  static success(message: string, data?: any, errorCode?: any) {
    return this.buildResponse(true, message, data, errorCode);
  }

  static failure(message: string, data?: any, errorCode?: any) {
    return this.buildResponse(false, message, data, errorCode);
  }

  static buildResponse(
    success: boolean,
    message: string,
    data?: any,
    errorCode?: any,
  ) {
    return {
      success,
      message,
      data,
      errorCode,
    };
  }
}
