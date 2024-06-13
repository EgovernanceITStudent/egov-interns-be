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
    // this.router.post("/login", this.login);
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

      const secretKey = process.env.SECRETKEY as string;
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

  // public async login(req: Request, res: Response) {
  //   let data = req.body;
  //   const User = await user.findOne({
  //     where: { username: data.username },
  //     attributes: [
  //       "password",
  //       "uid",
  //       "first_name",
  //       "last_name",
  //       "email",
  //       "username",
  //       "profile_image",
  //       "github_link",
  //       "linkdin_link",
  //     ],
  //   });
  //   if (User === null) {
  //     res.status(400).json({
  //       message: "User name does not exist",
  //     });
  //   }
  //   let userpassword = User?.getDataValue("password");
  //   const uid = User?.getDataValue("uid");
  //   await bcrypt.compare(data.password, userpassword);
  //   const payload = {
  //     uid: uid,
  //   };
  //   if (bcrypt) {
  //     const token = jwt.sign(payload, process.env.SECRETKEY as string, {
  //       expiresIn: "24",
  //     });
  //     res
  //       .cookie("token", token)
  //       .status(200)
  //       .json({
  //         message: {
  //           message: "success",
  //           data: User,
  //           token: token,
  //         },
  //       });
  //   }
  // }
}
