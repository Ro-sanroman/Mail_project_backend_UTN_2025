import MemberWorkspace from "../models/MemberWorkspace.model.js";

class MemberWorkspaceRepository {
    static async create(user_id, workspace_id, role) {
        try {
            const newMember = await MemberWorkspace.create({
                id_user: user_id,
                id_workspace: workspace_id,
                role: role
            })
            return newMember
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo crear el miembro de workspace', error);
            throw error
        }
    }
    static async getAll() {
        try {
            const member_worksapces = await MemberWorkspace.find()
            return member_worksapces
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener la lista de miembros')
            throw error
        }
    }
    static async getById(member_id) {
        try {
            const member_found = await MemberWorkspace.findById(member_id)
            return member_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo eliminar el miembro con el id' + member_id, error);
            throw error
        }
    }
    static async deleteById(member_id) {
        try {
            const member_workspeace_delete = await MemberWorkspace.findByIdAndDelete(member_id)
            return member_workspeace_delete
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo eliminar el miembro con el id' + member_id, error);
            throw error
        }
    }
    static async updateById(member_id, member_update) {
        try {
            const update = await MemberWorkspace.findByIdAndUpdate(member_id, member_update)
            return update
        }
        catch (error) {
            {
                console.error('[SERVER ERROR]: no se pudo actualizar el miembro', error)
                throw error
            }
        }
    }
    static async getByUserIdAndWorkspaceId(user_id, workspace_id) {
        try {
            const member = await MemberWorkspace.findOne({
                id_user: user_id,
                id_workspace: workspace_id
            })
            return member
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener el miembro con user_id y workspace_id', error)
            throw error
        }
    }
    static async getAllByUserId(user_id) {
        try {
            const members = await MemberWorkspace.find({
                id_user: user_id
            })
            return members
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener los miembros por user_id', error)
            throw error
        }
    }
}

export default MemberWorkspaceRepository