import { UserModel } from "../models/UserModel";
import { ProfileModel } from "../models/ProfileModel";
import { TemplateModel } from "../models/*TemplateModel";

export interface ModelsInterface{
    User: UserModel;
    Profile: ProfileModel;
    Template: TemplateModel;
}