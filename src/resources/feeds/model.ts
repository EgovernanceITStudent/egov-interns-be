import { db } from "../../db/index";
import { DataTypes,fn } from "sequelize";

export const feed = db.define(
    "Feed",{
        uid: {
            type: DataTypes.UUID, 
            defaultValue:fn("uuid_generate_v4"),
            primaryKey: true,
            allowNull: false
          },
          userid:{
            type: DataTypes.UUID,
            allowNull: false
          },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        like: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comment: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: true
        }
    }
)
feed.sync({force:true});