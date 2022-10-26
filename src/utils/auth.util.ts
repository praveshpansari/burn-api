import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";

export interface Context {
  req: Request;
  res: Response;
  payload?: { _id: string; email: string };
}

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"] as string;
  if (!authorization) throw new Error("Not Authenticated");

  try {
    const token = authorization.split(" ")[1];
    const user = verify(token, process.env.JWT_SECRET!);
    context.payload = user as any;
    return next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }

  //   // if `@Authorized()`, check only if user exists
  //   if (roles.length === 0) return isPresent(user);

  //   // roles are there now

  //   // if no user, restrict access
  //   if (!user) return false;

  //   // grant access if the user has role
  //   if (roles.includes(user.role)) return true;

  //   // no roles matched, restrict access
  //   return false;
};
