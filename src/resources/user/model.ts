import {DataTypes,fn } from "sequelize";
import { db } from "../../db/index";


export const user = db.define(
    'User',
    {
        uid: {
        type: DataTypes.UUID, 
        defaultValue:fn("uuid_generate_v4"),
        primaryKey: true,
        allowNull: false
      },
        firstName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        lastName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        dob:{
            type:DataTypes.DATE,
            allowNull:false
        },
        linkdinLink:{
            type:DataTypes.STRING,
            allowNull:true
        },
        githubLink:{
            type:DataTypes.STRING,
            allowNull:true
        }
},{underscored:true})


// user.sync({force:true})