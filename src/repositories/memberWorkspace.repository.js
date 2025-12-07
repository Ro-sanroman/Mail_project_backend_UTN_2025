import MemberWorkspace from "../models/MemberWorkspace.model.js";

class MemberWorkspaceRepository {

    static async create(user_id, workspace_id, role) {
        try {
            console.log('[MemberWorkspaceRepository] create - user_id:', user_id, 'type:', typeof user_id)
            console.log('[MemberWorkspaceRepository] create - workspace_id:', workspace_id, 'type:', typeof workspace_id)
            console.log('[MemberWorkspaceRepository] create - role:', role)
            const member = await MemberWorkspace.create({
                id_user: user_id,
                id_workspace: workspace_id,
                role: role
            })
            console.log('[MemberWorkspaceRepository] MemberWorkspace creado:', member._id)
            console.log('[MemberWorkspaceRepository] MemberWorkspace completo:', JSON.stringify(member, null, 2))
            return member
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

    static async getAllByUserId(user_id){
        try {
            console.log('[MemberWorkspaceRepository] getAllByUserId - user_id:', user_id, 'type:', typeof user_id)
            
            // Primero buscar sin populate para ver si hay registros
            const membersRaw = await MemberWorkspace.find({id_user: user_id})
            console.log('[MemberWorkspaceRepository] getAllByUserId - registros sin populate:', membersRaw?.length || 0)
            if (membersRaw && membersRaw.length > 0) {
                console.log('[MemberWorkspaceRepository] getAllByUserId - primer registro:', JSON.stringify(membersRaw[0], null, 2))
            }
            
            const members = await MemberWorkspace.find({id_user: user_id}).populate('id_workspace')
            console.log('[MemberWorkspaceRepository] getAllByUserId - members con populate:', members?.length || 0)
            if (members && members.length > 0) {
                console.log('[MemberWorkspaceRepository] getAllByUserId - primer member con populate:', JSON.stringify(members[0], null, 2))
            }

            const members_list_formatted = members
                .filter(member => {
                    const hasWorkspace = member.id_workspace != null
                    const isActive = !member.id_workspace || member.id_workspace.active !== false
                    console.log('[MemberWorkspaceRepository] Filtrando member:', {
                        member_id: member._id,
                        hasWorkspace,
                        isActive,
                        workspace_name: member.id_workspace?.name
                    })
                    return hasWorkspace && isActive
                })
                .map(
                    (member) => {
                        const formatted = {
                            workspace_id: member.id_workspace._id,
                            workspace_name: member.id_workspace.name,
                            workspace_created_at: member.id_workspace.created_at,
                            workspace_url_image: member.id_workspace.url_img,
                            member_id: member._id,
                            member_user_id: member.id_user,
                            member_role: member.role
                        }
                        console.log('[MemberWorkspaceRepository] Workspace formateado:', formatted)
                        return formatted
                    }
                )
            console.log('[MemberWorkspaceRepository] getAllByUserId - retornando', members_list_formatted.length, 'workspaces')
            return members_list_formatted
        } catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener los miembros por user_id', error)
            console.error('[SERVER ERROR]: Stack:', error.stack)
            throw error
        }
    }

    static async getByUserIdAndWorkspaceId(user_id, workspace_id){
        const member = await MemberWorkspace.findOne({id_user: user_id, id_workspace: workspace_id})
        return member
    }

    static async getWorkspaceIdsByUserId(user_id){
        try {
            console.log('[MemberWorkspaceRepository] getWorkspaceIdsByUserId - user_id:', user_id)
            console.log('[MemberWorkspaceRepository] user_id type:', typeof user_id)
            const members = await MemberWorkspace.find({id_user: user_id}).select('id_workspace').lean()
            console.log('[MemberWorkspaceRepository] Members encontrados:', members?.length || 0)
            console.log('[MemberWorkspaceRepository] Members completos:', JSON.stringify(members, null, 2))
            
            if (!members || members.length === 0) {
                console.log('[MemberWorkspaceRepository] No se encontraron miembros para el usuario')
                return []
            }
            
            const workspace_ids = members
                .map(m => m.id_workspace)
                .filter(id => id != null && id !== undefined)
            
            console.log('[MemberWorkspaceRepository] Workspace IDs extraídos:', workspace_ids.length)
            return workspace_ids
        } catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener los workspace IDs', error)
            console.error('[SERVER ERROR]: Stack:', error.stack)
            throw error
        }
    }

    static async deleteManyByWorkspaceId(workspace_id){
        try{
            await MemberWorkspace.deleteMany({ id_workspace: workspace_id })
        }
        catch(error){
            console.error('[SERVER ERROR]: no se pudo eliminar miembros del workspace', error)
            throw error
        }
    }
}


export default MemberWorkspaceRepository