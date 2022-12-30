import APIResponse from "../interfaces/APIResponse";
export default class RESTResponse {
  public static createResponse(
    success: boolean,
    message: string,
    data: object
  ): APIResponse {
    const response: APIResponse = {
      success,
      message,
      data,
    };
    return response;
  }
}
