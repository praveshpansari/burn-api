import { UserSchema } from "./schema/user.schema";
import { merge } from "lodash";

export const schema = merge(UserSchema);
