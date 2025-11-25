import Workspace from "../models/Workspace.model.js";

class WorkspaceRepository {
    static async create(name, url_image) {
        try {
            const newWorkspace = await Workspace.create({
                name: name,
                url_image: url_image
            })
            return newWorkspace
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo crear el workspace', error);
            throw error
        }
    }
    static async getAll() {
        try {
            const worksapces = await Workspace.find({ active: true })
            return worksapces
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener la lista de worksapces')
            throw error
        }
    }
    static async getById(workspace_id) {
        try {
            const workspace_found = await Workspace.findById(workspace_id)
            return workspace_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo eliminar el workspace con el id' + workspace_id, error);
            throw error
        }
    }
    static async deleteById(workspace_id) {
        try {
            const workspaece_delete = await Workspace.findByIdAndDelete(workspace_id)
            return workspaece_delete
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo eliminar el worksapce con el id' + workspace_id, error);
            throw error
        }
    }
    static async updateById(worksapce_id, worksapce_update) {
        try {
            const update = await Workspace.findByIdAndUpdate(worksapce_id, worksapce_update)
            return update
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo actualizar el workspace', error)
            throw error
        }
    }
    static async getManyByIds(workspace_ids) {
        try {
            if (!workspace_ids || workspace_ids.length === 0) {
                console.log('[WorkspaceRepository] getManyByIds: No hay IDs, retornando array vacío')
                return []
            }
            
            console.log('[WorkspaceRepository] getManyByIds: Buscando', workspace_ids.length, 'workspaces')
            console.log('[WorkspaceRepository] getManyByIds: IDs recibidos:', workspace_ids)
            
            const validIds = workspace_ids
                .filter(id => id != null && id !== undefined)
                .map(id => {
                })
            
            if (validIds.length === 0) {
                console.log('[WorkspaceRepository] getManyByIds: No hay IDs válidos después del filtrado')
                return []
            }
            
            console.log('[WorkspaceRepository] getManyByIds: IDs válidos:', validIds.length)
            
            const workspaces = await Workspace.find({ 
                _id: { $in: validIds },
                $or: [
                    { active: true },
                    { active: { $exists: false } }
                ]
            })
            
            console.log('[WorkspaceRepository] getManyByIds: Encontrados', workspaces.length, 'workspaces')
            return workspaces
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener los workspaces por IDs', error)
            console.error('[SERVER ERROR]: Stack trace:', error.stack)
            console.error('[SERVER ERROR]: Error name:', error.name)
            console.error('[SERVER ERROR]: Error message:', error.message)
            throw error
        }
    }
}

export default WorkspaceRepository