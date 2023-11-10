/**
 * CustomError is a class that extends the standard Error class and is designed to create custom errors with associated HTTP status codes and descriptive error messages.
 */

export class CustomError extends Error {
  //The HTTP status code associated with the error.
  statusCode: number;

  /**
   * Create a new custom error instance.
   * @param statusCode - The HTTP status code to be associated with the error.
   * @param message - A descriptive error message.
   */

  constructor(statusCode: number, message: string) {
    super(message); // inheriting from the Error superclass.
    this.statusCode = statusCode;
  }
}

/**
 * creatCustomError creates a new custom error instance with a given HTTP status code and message.
 *
 * @param statusCode - The HTTP status code to be associated with the error.
 * @param message - A descriptive error message.
 * @returns CustomError instance.
 */
export const createCustomError = (
  statusCode: number,
  message: string
): CustomError => {
  return new CustomError(statusCode, message);
};
