export interface ApiResponseData<T, E = null> {
  message: string;
  statusCode: number;
  data?: T;
  error?: E|Error|string|unknown;
}
