// src/utils/AppError.ts
// export class AppError extends Error {
//   statusCode: number;
//   code: string;

//   constructor(message: string, statusCode = 400, code = "APP_ERROR") {
//     super(message);
//     this.statusCode = statusCode;
//     this.code = code;
//   }
// }








// src/utils/AppError.ts

export interface AppErrorData {
  conflicts?: unknown
  alternatives?: unknown
  [key: string]: unknown
}

export class AppError extends Error {
  statusCode: number
  code: string
  data?: AppErrorData

  constructor(
    message: string,
    statusCode = 400,
    code = "APP_ERROR",
    data?: AppErrorData
  ) {
    super(message)

    this.name = "AppError"
    this.statusCode = statusCode
    this.code = code
    this.data = data

    Object.setPrototypeOf(this, new.target.prototype)
  }
}