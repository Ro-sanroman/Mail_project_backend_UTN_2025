import MessagesChannelRepository from "../repositories/messageChannel.repository.js"
import { ServerError } from "../error.js"

class MessageService {
    static async create(content, member_id, channel_id){
        const message_created = await MessagesChannelRepository.create(channel_id, member_id, content)
        const messages = await MessagesChannelRepository.getAllByChannelId(channel_id)
        return {
            messages: messages,
            message_created: message_created
        }
    }
    static async getAllByChannelId(channel_id){
        const messages = await MessagesChannelRepository.getAllByChannelId(channel_id)
        return {
            messages: messages
        }
    }

    static async delete(message_id, member, channel_id){
        const message = await MessagesChannelRepository.getById(message_id)
        if(!message){
            throw new ServerError(404, 'Mensaje no encontrado')
        }

        const isOwner = message.sender_member_id?.toString() === member._id.toString()
        if(!isOwner && member.role !== 'admin'){
            throw new ServerError(403, 'No puedes eliminar este mensaje')
        }

        await MessagesChannelRepository.deleteById(message_id)
        const messages = await MessagesChannelRepository.getAllByChannelId(channel_id)
        return { messages }
    }
}

export default MessageService