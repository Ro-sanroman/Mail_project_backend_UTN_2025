import ChannelRepository from "../repositories/channel.repository.js";
import MessagesChannelRepository from "../repositories/messageChannel.repository.js";

class ChannelService {
    static async getAllByWorkspaceId (workspace_id){
        return await ChannelRepository.getAllByWorkspaceId(workspace_id)
    }

    static async create (workspace_id, name){
        await ChannelRepository.create( workspace_id, name)
        return await ChannelRepository.getAllByWorkspaceId(workspace_id)
    }

    static async delete(workspace_id, channel_id){
        await ChannelRepository.deleteById(channel_id)
        await MessagesChannelRepository.deleteManyByChannelIds([channel_id])
        return await ChannelRepository.getAllByWorkspaceId(workspace_id)
    }
}


export default ChannelService