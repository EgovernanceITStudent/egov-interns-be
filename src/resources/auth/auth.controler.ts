import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validation from "../../middlewares/validation.middleware";
import { userSignupSchema } from "./auth.schema";
import asyncWrap from "../../utils/asyncWrapper";
import { Op } from "sequelize";
import HttpException from "../../utils/http.exception";
import {
  AuthenticatedRequest,
  authCheck,
} from "../../middlewares/authCheck.middleware";
import type User from "../../db/models/user";
import type { UserAttributes } from "../../db/models/user";
import { db } from "../../db/models";
import "dotenv/config";

type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  dob: Date;
  schoolName: string;
  schoolDepartment: string;
};

export type CreatedUserAttributes = Omit<UserAttributes, "password">;

export class AuthController {
  router: Router;
  path: string;

  constructor() {
    this.router = Router();
    this.path = "";
    this.initRoute();
  }

  initRoute() {
    this.router.post("/signup", validation(userSignupSchema), this.signup);
    this.router.post("/login", this.login);
    this.router.get("/user", authCheck, this.getAuthUser);
  }

  private signup = asyncWrap(
    async (req: Request<any, any, SignUpData>, res: Response) => {
      let userData = req.body;

      const existingUsers: User[] = await db.user.findAll({
        where: {
          [Op.or]: {
            username: userData.username,
            email: userData.email,
          },
        },
      });

      if (existingUsers.length) {
        const exitstingFields: string[] = [];

        existingUsers.forEach((user) => {
          if (user.username === userData.username.toLowerCase()) {
            exitstingFields.push("username");
          }
          if (user.email === userData.email.toLowerCase()) {
            exitstingFields.push("email");
          }
        });

        const message = exitstingFields.join(" and ");

        throw new HttpException(
          409,
          `User with the provided ${message} already exists`,
        );
      }

      const hashedPassword = bcrypt.hashSync(userData.password, 10);

      let newUser = await db.user.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        dob: userData.dob,
        schoolName: userData.schoolName,
        schoolDepartment: userData.schoolDepartment,
        password: hashedPassword,
      });

      const createdUser: CreatedUserAttributes = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username,
        dob: newUser.dob,
        schoolName: newUser.schoolName,
        schoolDepartment: newUser.schoolDepartment,
        linkedInLink: newUser.linkedInLink,
        githubLink: newUser.githubLink,
        profileImage: newUser.profileImage,
        bio: newUser.bio,
      };

      const payload = {
        uid: createdUser.id,
      };

      const secretKey = process.env.SECRETKEY as string;
      const token = jwt.sign(payload, secretKey, {
        expiresIn: "30m",
      });

      return res.status(201).json({
        success: true,
        user: createdUser,
        token: token,
      });
    },
  );

  private login = asyncWrap(async (req: Request, res: Response) => {
    let loginData = req.body;

    const user: User = await db.user.findOne({
      where: { username: loginData.username },
    });

    if (!user) {
      throw new HttpException(401, "Invalid login credentials");
    }

    let userpassword = user.password;
    const validPassword = await bcrypt.compare(
      loginData.password,
      userpassword,
    );

    if (!validPassword) {
      throw new HttpException(401, "Invalid login credentials");
    }

    const uid = user?.id;
    const payload = {
      uid: uid,
    };

    const secretKey = process.env.SECRETKEY as string;
    const token = jwt.sign(payload, secretKey, {
      expiresIn: "1d",
    });

    const loggedInUser: CreatedUserAttributes = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      dob: user.dob,
      schoolName: user.schoolName,
      schoolDepartment: user.schoolDepartment,
      linkedInLink: user.linkedInLink,
      githubLink: user.githubLink,
      profileImage: user.profileImage,
      bio: user.bio,
    };

    res.status(200).json({
      success: true,
      user: loggedInUser,
      token: token,
    });
  });

  private getAuthUser = asyncWrap(
    async (req: AuthenticatedRequest, res: Response) => {
      const id = req.uid;

      const user = await db.user.findOne({ where: { id } });

      if (!user) {
        throw new HttpException(404, "User does not exist");
      }

      const authUser: CreatedUserAttributes = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        dob: user.dob,
        schoolName: user.schoolName,
        schoolDepartment: user.schoolDepartment,
        linkedInLink: user.linkedInLink,
        githubLink: user.githubLink,
        profileImage: user.profileImage,
        bio: user.bio,
      };

      return res.status(200).json({ success: true, user: authUser });
    },
  );
}
