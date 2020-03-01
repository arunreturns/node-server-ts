import { Application, Response, Request } from "express";
import jsonwebtoken from "jsonwebtoken";

const cookieName: string = process.env.COOKIE_NAME;
const jwtSecret: any = process.env.JWT_SECRET;

class AuthController {
  static registerController(app: Application, url: string = "/auth") {
    app.get(`${url}/registerToken`, this.registerToken);

    /*
      Auth Cookie Parser
      If cookies contain the authCookie, use jsonwebtoken to verify the JWT
      If verified successfully, pass it along in the headers and proceed to the next middleware
      If not verified, clear the headers and proceed to next middleware
    */
    app.use((req: Request, _: Response, next: Function) => {
      if (req.cookies && req.cookies[cookieName]) {
        jsonwebtoken.verify(
          req.cookies[cookieName],
          jwtSecret,
          (err: Error, decode: any) => {
            if (err) req.headers["user"] = undefined;
            req.headers["user"] = decode;
            next();
          },
        );
      } else {
        req.headers["user"] = undefined;
        next();
      }
    });

    /*
      Auth Filter
      If user is not part of the headers, return 401 - User Unauthorized
      If user is present, proceed to next middleware
    */
    app.use((req: Request, res: Response, next: Function) => {
      if (req.headers["user"]) {
        next();
      } else {
        return res.status(401).json({ message: "User Unauthorized" });
      }
    });
  }

  static async registerToken(req: Request, res: Response) {
    /* Add XSRF-TOKEN to the header only during registering the token */
    const csrfToken = req.csrfToken();
    res.cookie("xsrf-token", csrfToken);

    /* Sign a new JWT and return it to the user */
    const jwtToken = jsonwebtoken.sign(
      { username: "John Doe", email: "johndoe@mail.com", id: "@johndoe" },
      jwtSecret,
    );
    res.cookie(cookieName, jwtToken, { maxAge: 1800000 });
    return res.send({
      message: "User login successful",
    });
  }
}

export default AuthController;
