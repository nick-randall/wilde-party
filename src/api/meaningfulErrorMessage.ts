import { AxiosError } from "axios";
import { ErrorMessage } from "../SessionProvider";

export const meaningfulErrorMessage = (error: unknown) => {
  const e = error as AxiosError
  if (!e.response) return "unknown error";
  const errorIsCustomError = typeof e.response.data === "object";

  if (errorIsCustomError) {
    const error = e.response.data as ErrorMessage;
    return error.message;
  } else {
    return e.response.statusText;
  }
};
