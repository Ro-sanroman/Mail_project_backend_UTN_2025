import { ServerError } from "../error.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"


function workspaceMiddleware(valid_member_roles = []) {
    return async function (request, response, next) {
        try {

            const { workspace_id } = request.params
            const user = request.user

            console.log('[workspaceMiddleware] workspace_id recibido:', workspace_id)
            console.log('[workspaceMiddleware] user.id:', user.id)

            const workspace_selected = await WorkspaceRepository.getById(workspace_id)
            console.log('[workspaceMiddleware] workspace_selected:', workspace_selected ? 'ENCONTRADO' : 'NO ENCONTRADO')
            if (!workspace_selected) {
                throw new ServerError(404, 'Workspace no encontrado')
            }

            const member = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(user.id, workspace_id)
            console.log('[workspaceMiddleware] member:', member ? 'ENCONTRADO' : 'NO ENCONTRADO')
            if (!member) {
                throw new ServerError(403, 'No tienes acceso a este espacio de trabajo')
            }

            if (valid_member_roles.length > 0 && !valid_member_roles.includes(member.role)) {
                throw new ServerError(403, 'No puedes esta operacion')
            }

            request.member = member
            request.workspace_selected = workspace_selected
            next()
        }
        catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else {
                console.error(
                    'ERROR en workspaceMiddleware', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }
}

export default workspaceMiddleware
