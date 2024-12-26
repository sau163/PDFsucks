import { ApiError } from "../../utils/error.util.js";
import domains from "../../resources/domains.resource.json" assert { type: "json" }

export const emailValidation = (email) => {
  const domain = email.split('@');
  
  if (domain[1] === '') throw new ApiError(400, "please provide email correctly");
  else if (!domains.includes(domain[1])) throw new ApiError(400, "please provide a valid email");
}
