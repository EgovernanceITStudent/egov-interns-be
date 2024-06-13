import { Request, Response, Router } from "express";
import { User, UserAttributes } from "../users/model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validation from "../../middlewares/validation.middleware";
import { userSignupSchema } from "./auth.schema";
import asyncWrap from "../../utils/asyncWrapper";
import { Op } from "sequelize";
import HttpException from "../../utils/http.exception";

dotenv.config();

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

type CreatedUserAttributes = Omit<UserAttributes, "password">;

export class Authcontroller {
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
  }

  private signup = asyncWrap(
    async (req: Request<any, any, SignUpData>, res: Response) => {
      let userData = req.body;

      const existingUsers = await User.findAll({
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
          if (user.username === userData.username) {
            exitstingFields.push("username");
          }
          if (user.email === userData.email) {
            exitstingFields.push("email");
          }
        });

        const message = exitstingFields.join(" and ");

        throw new HttpException(
          409,
          `User with the provided ${message} already exists`
        );
      }

      const hashedPassword = bcrypt.hashSync(userData.password, 10);

      let newUser = await User.create({
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

      const secretKey = process.env.SECRETKEY!;
      const token = jwt.sign(payload, secretKey, {
        expiresIn: "15m",
      });

      return res.status(201).json({
        success: true,
        user: createdUser,
        token: token,
      });
    }
  );

  private login = asyncWrap(async (req: Request, res: Response) => {
    let loginData = req.body;

    const user = await User.findOne({
      where: { username: loginData.username },
    });

    if (!user) {
      throw new HttpException(401, "Invalid login credentials");
    }

    let userpassword = user.password;
    const validPassword = await bcrypt.compare(
      loginData.password,
      userpassword
    );

    if (!validPassword) {
      throw new HttpException(401, "Invalid login credentials");
    }

    const uid = user?.id;
    const payload = {
      uid: uid,
    };

    const secretKey = process.env.SECRETKEY!;
    const token = jwt.sign(payload, secretKey, {
      expiresIn: "15m",
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
}
