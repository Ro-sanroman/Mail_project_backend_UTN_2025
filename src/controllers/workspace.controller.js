import ENVIRONMENT from "../config/environment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { ServerError } from "../error.js";
import ChannelRepository from "../repositories/channel.repository.js";
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js";
import UserRepository from "../repositories/user.repository.js";
import WorkspaceRepository from "../repositories/workspace.repository.js";
import ChannelService from "../sevices/channel.service.js";
import WorkspaceService from "../sevices/workspace.service.js";
import jwt from "jsonwebtoken";

class WorkspaceController {
  static async getAll(request, response) {
    try {
      console.log("USER EN REQUEST:", request.user);
      const user = request.user;

      if (!user || !user.id) {
        console.error("ERROR: Usuario no encontrado en request");
        return response.status(401).json({
          ok: false,
          message: "Usuario no autenticado",
          status: 401,
        });
      }

      console.log("Obteniendo workspaces para user_id:", user.id);
      const workspaces = await WorkspaceService.getAll(user.id);
      console.log("Workspaces obtenidos:", workspaces?.length || 0);

      const workspacesFormatted = (workspaces || []).map(workspace => {
        const workspaceId = workspace._id ? (workspace._id.toString ? workspace._id.toString() : workspace._id) : null;
        return {
          workspace_id: workspaceId,
          workspace_name: workspace.name || '',
          workspace_created_at: workspace.created_at || null,
          workspace_url_image: workspace.url_img || null
        };
      });

      response.status(200).json({
        ok: true,
        status: 200,
        message: "Espacios de trabajo obtenidos exitosamente",
        data: {
          workspaces: workspacesFormatted,
        },
      });
    } catch (error) {
      console.error("ERROR AL OBTENER LOS WORKSPACES - Detalles completos:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        status: error.status
      });
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          message: error.message,
          status: error.status,
        });
      } else {
        return response.status(500).json({
          ok: false,
          message: "Error interno del servidor",
          status: 500,
        });
      }
    }
  }
  static async create(request, response) {
    try {
      const user = request.user;
      const { name, url_img } = request.body;

      const workspace_created = await WorkspaceService.create(
        user.id,
        name,
        url_img
      );

      response.status(201).json({
        status: 201,
        ok: true,
        message: "Workspace creado con exito",
        data: {
          workspace_created,
        },
      });
    } catch (error) {
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          message: error.message,
          status: error.status,
        });
      } else {
        console.error("ERROR AL OBTENER LOS WORKSPACES", error);
        return response.status(500).json({
          ok: false,
          message: "Error interno del servidor",
          status: 500,
        });
      }
    }
  }

  static async delete(request, response) {
    try {
      const { workspace_selected } = request;
      await WorkspaceService.delete(workspace_selected._id);

      return response.status(200).json({
        ok: true,
        status: 200,
        message: "Workspace eliminado con exito",
      });
    } catch (error) {
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          message: error.message,
          status: error.status,
        });
      } else {
        console.error("ERROR AL eliminar workspace", error);
        return response.status(500).json({
          ok: false,
          message: "Error interno del servidor",
          status: 500,
        });
      }
    }
  }

  static async invite(request, response) {
    try {
      const { member, workspace_selected, user } = request;
      const { email_invited, role_invited } = request.body;

      await WorkspaceService.invite(
        member,
        workspace_selected,
        email_invited,
        role_invited
      );
      response.json({
        status: 200,
        message: "Invitacion enviada",
        ok: true,
      });
      
    } catch (error) {
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          message: error.message,
          status: error.status,
        });
      } else {
        console.error("ERROR AL invitar", error);
        return response.status(500).json({
          ok: false,
          message: "Error interno del servidor",
          status: 500,
        });
      }
    }
  }

  static async getById(request, response) {
    try {
      const { workspace_selected, member, user } = request;

      const channels = await ChannelService.getAllByWorkspaceId(
        workspace_selected._id
      );

      response.json({
        ok: true,
        status: 200,
        message: "Espacio de trabajo obtenido",
        data: {
          workspace_detail: workspace_selected,
          channels: channels,
        },
      });
    } catch (error) {
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          message: error.message,
          status: error.status,
        });
      } else {
        console.error("ERROR AL obtener detalles del workspace", error);
        return response.status(500).json({
          ok: false,
          message: "Error interno del servidor",
          status: 500,
        });
      }
    }
  }
}

export default WorkspaceController;
