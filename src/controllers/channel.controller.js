import ChannelService from "../sevices/channel.service.js";

class ChannelController {
    static async create(request, response) {
        try {
            const { workspace_selected } = request;
            const { name } = request.body;
            // Validar nombre de canal ok
            if (!name) {
                return response.status(400).json({
                    ok: false,
                    message: 'El nombre del canal es requerido',
                });
            }
            // Crear el canal usando .createChannel
            const channel_list = await ChannelService.create(workspace_selected.id, name);
            response.status(201).json({
                ok: true,
                message: 'Canal creado',
                status: 201,
                data: {
                    channels: channel_list
                }
            });
        } catch (error) {
            console.error('Error al crear:', error);
            response.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    }

    static async delete(request, response) {
        try {
            const { workspace_selected, channel_selected } = request;
            const channel_list = await ChannelService.delete(workspace_selected._id, channel_selected._id);
            return response.status(200).json({
                ok: true,
                message: 'Canal eliminado',
                status: 200,
                data: {
                    channels: channel_list
                }
            });
        } catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                });
            }
            console.error('Error al eliminar canal', error);
            return response.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
                status: 500
            });
        }
    }
}


export default ChannelController