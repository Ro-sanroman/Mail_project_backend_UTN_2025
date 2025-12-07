import ENVIRONMENT from "../config/environment.config.js"
import mailTransporter from "../config/mailTransporter.config.js"
import { ServerError } from "../error.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import ChannelRepository from "../repositories/channel.repository.js"
import MessagesChannelRepository from "../repositories/messageChannel.repository.js"
import jwt from 'jsonwebtoken'

class WorkspaceService {
    static async getAll(user_id) {
        try {
            console.log('[WorkspaceService] getAll - user_id:', user_id)
            
            const members = await MemberWorkspaceRepository.getAllByUserId(user_id)
            console.log('[WorkspaceService] members obtenidos:', members?.length || 0)

            if (!members || members.length === 0) {
                console.log('[WorkspaceService] No hay workspaces para el usuario')
                return []
            }

            // Los miembros ya vienen con los datos del workspace formateados
            return members
        } catch (error) {
            console.error('[WorkspaceService] Error en getAll:', error)
            console.error('[WorkspaceService] Stack:', error.stack)
            throw error
        }
    }

    static async create(user_id, name, url_img) {
        console.log('[WorkspaceService] create - user_id:', user_id, 'name:', name)
        
        const workspace_created = await WorkspaceRepository.create(name, url_img)
        console.log('[WorkspaceService] workspace_created:', workspace_created._id)

        await MemberWorkspaceRepository.create(user_id, workspace_created._id, 'admin')
        console.log('[WorkspaceService] MemberWorkspace creado para user_id:', user_id, 'workspace_id:', workspace_created._id)

        return workspace_created
    }

    static async invite(member, workspace_selected, email_invited, role_invited) {
        const user_invited = await UserRepository.getByEmail(email_invited)
        if (!user_invited) {
            throw new ServerError(404, 'No existe el usuario')
        }

        const already_member = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(user_invited._id, workspace_selected._id)

        if (already_member) {
            throw new ServerError(400, 'Usuario ya es un miembro de este workspace')
        }

        const invitation_token = jwt.sign(
            {
                id_invited: user_invited._id,
                id_inviter: member._id,
                id_workspace: workspace_selected._id,
                invited_role: role_invited
            },
            ENVIRONMENT.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        )

        await mailTransporter.sendMail({
            to: email_invited,
            from: ENVIRONMENT.GMAIL_USER,
            subject: "Te han invitado a un espacio de trabajo",
            html: `
                        <h1>Has sido invitado al workspace: ${workspace_selected.name}</h1>
                        <a href="${ENVIRONMENT.URL_BACKEND}/api/member/confirm/${invitation_token}">Aceptar</a>
                        `
        })
    }

    static async delete(workspace_id) {
        const channels = await ChannelRepository.getAllByWorkspaceId(workspace_id) || []
        const channelIds = channels.map(channel => channel._id)

        if (channelIds.length > 0) {
            await MessagesChannelRepository.deleteManyByChannelIds(channelIds)
            await ChannelRepository.deleteManyByWorkspaceId(workspace_id)
        } else {
            await ChannelRepository.deleteManyByWorkspaceId(workspace_id)
        }

        await MemberWorkspaceRepository.deleteManyByWorkspaceId(workspace_id)
        await WorkspaceRepository.deleteById(workspace_id)
    }

}


export default WorkspaceService