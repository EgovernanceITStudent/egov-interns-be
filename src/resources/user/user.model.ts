import { Model, DataTypes, Optional, fn } from "sequelize";
import { db } from "../../db";

export type UserAttributes = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  dob: Date;
  schoolName: string;
  schoolDepartment: string;
  linkedInLink: string;
  githubLink: string;
  profileImage: string;
  bio: string;
};

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "bio" | "profileImage" | "linkedInLink" | "githubLink"
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public dob!: Date;
  public schoolName!: string;
  public schoolDepartment!: string;
  public linkedInLink!: string;
  public githubLink!: string;
  public profileImage!: string;
  public bio!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: fn("uuid_generate_v4"),
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
      set(val: string) {
        this.setDataValue("email", val.toLowerCase());
      },
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      set(val: string) {
        this.setDataValue("username", val.toLowerCase());
      },
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    schoolName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    schoolDepartment: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    linkedInLink: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    githubLink: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    profileImage: {
      type: new DataTypes.STRING(1024),
      allowNull: true,
    },
    bio: {
      type: new DataTypes.STRING(1024),
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: "users",
    underscored: true,
  },
);

export { User };

// User.sync({ force: true });
