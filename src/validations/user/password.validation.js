import { ApiError } from "../../utils/error.util.js";
import illegalChars from "../../resources/illegalChars.resource.json" assert { type: "json" };

export const passwordValidation = (password) => {
  if (password.length < 8) throw new ApiError(400, "password length should be greater than or equal to 8 letters");

  for (let char of password) if (illegalChars.includes(char)) throw new ApiError(400, `password contains illegal character: ${char}`);
}
