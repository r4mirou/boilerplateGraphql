import { UserModel, UserInstance } from "../../models/UserModel";
import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";
const { Op } = require("sequelize");

export class UserLoader {

    static async batchUsers(
        User: UserModel,
        params: DataLoaderParam<number>[],
        requestedFields: RequestedFields,
    ): Promise<UserInstance[]> {
        let ids: number[] = params.map(param => param.key)

        const users = await Promise.resolve(
          User.findAll({
            where: { id: { [Op.in]: ids } },
            attributes: requestedFields.getFields(params[0].info, {
              keep: ['id'],
            }),
          }),
        )

        const usersMap = users.reduce(
          (prev, user) => ({
            ...prev,
            [user.id]: user,
          }),
          {},
        )

        return ids.map(id => usersMap[id])
    }

}