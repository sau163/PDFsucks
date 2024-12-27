class ApiResponse {
  constructor(
    statusCode,
    data,
    user,
    message = "Success"
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.user = user;
  }
}

export { ApiResponse };
