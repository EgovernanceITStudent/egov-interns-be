import { Request, Response, Router } from "express";
import { User } from "./user.model";
import multer from "multer";
import { Middleware } from "../../utils/middleware";
import {
  AuthenticatedRequest,
  authCheck,
} from "../../middlewares/authCheck.middleware";
import asyncWrap from "../../utils/asyncWrapper";
import HttpException from "../../utils/http.exception";
import { CreatedUserAttributes } from "../auth/auth.controler";
import validation from "../../middlewares/validation.middleware";
import { userUpdateSchema } from "./user.schema";

type UserUpdateData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
  dob: Date;
  schoolName: string;
  schoolDepartment: string;
};

export class UserController {
  path: string;
  router: Router;

  constructor() {
    this.path = "";
    this.router = Router();

    this.initializeRoutes();
  }

  initializeRoutes() {
    const storage = multer.memoryStorage();
    const upload = multer({ storage });

    this.router.patch(
      "/users/:id",
      authCheck,
      validation(userUpdateSchema),
      this.updateUser
    );
    this.router.delete("/users/:id", authCheck, this.deleteUser);
    this.router.post(
      "/uploadimage",
      new Middleware().authchecker,
      new Middleware().checking,
      upload.single("image"),
      this.uploadimage
    );
  }

  public async deleteUser(req: AuthenticatedRequest, res: Response) {
    const userId = req.params.id;
    await User.destroy({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      message: "user has been deleted",
    });
  }

  public updateUser = asyncWrap(
    async (req: Request<any, any, UserUpdateData>, res: Response) => {
      const userId = req.params.id;
      const updateData = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        throw new HttpException(404, "User does not exist");
      }

      user.bio = updateData.bio;
      user.username = updateData.username;
      user.firstName = updateData.firstName;
      user.lastName = updateData.lastName;
      user.email = updateData.email;
      user.dob = updateData.dob;
      user.schoolName = updateData.schoolName;
      user.schoolDepartment = updateData.schoolDepartment;

      await user.save();

      const updatedUser: CreatedUserAttributes = {
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

      return res.status(200).json({
        success: true,
        user: updatedUser,
      });
    }
  );

  public async uploadimage(req: Request, res: Response) {
    const data = req.file;
    const datapath = req.customData.uid;

    await new Middleware().uploadimg(datapath, data?.buffer);
    const url =
      (((process.env.PROJECTURL as string) +
        "/storage/v1/object/public/" +
        process.env.BUCKETNAME) as string) +
      "/" +
      datapath;
    const usr: any | null = await User.findOne({
      where: {
        id: req.customData.uid,
      },
      attributes: ["uid", "profile_image"],
    });
    usr.profile_image = url;
    await usr.save();
    res.status(200).json({
      data: data,
      message: "success",
    });
  }
}
