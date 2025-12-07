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
      console.log("\n[WorkspaceController.getAll] ========== INICIANDO ==========");
      console.log("[WorkspaceController.getAll] USER EN REQUEST:", request.user);
      const user = request.user;

      if (!user || !user.id) {
        console.error("[WorkspaceController.getAll] ERROR: Usuario no encontrado en request");
        return response.status(401).json({
          ok: false,
          message: "Usuario no autenticado",
          status: 401,
        });
      }

      console.log("[WorkspaceController.getAll] user.id:", user.id);
      console.log("[WorkspaceController.getAll] user.id type:", typeof user.id);
      console.log("[WorkspaceController.getAll] Obteniendo workspaces para user_id:", user.id);
      const workspaces = await WorkspaceService.getAll(user.id);
      console.log("[WorkspaceController.getAll] Workspaces obtenidos:", workspaces?.length || 0);
      console.log("[WorkspaceController.getAll] Workspaces:", JSON.stringify(workspaces, null, 2));

      // El servicio ya devuelve los workspaces formateados desde MemberWorkspaceRepository.getAllByUserId
      response.status(200).json({
        ok: true,
        status: 200,
        message: "Espacios de trabajo obtenidos exitosamente",
        data: {
          workspaces: workspaces || [],
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
      console.log("\n[WorkspaceController.create] ========== INICIANDO ==========");
      const user = request.user;
      console.log("[WorkspaceController.create] user:", user);
      console.log("[WorkspaceController.create] user.id:", user.id);
      console.log("[WorkspaceController.create] user.id type:", typeof user.id);
      
      const { name, url_img } = request.body;
      console.log("[WorkspaceController.create] name:", name);

      const workspace_created = await WorkspaceService.create(
        user.id,
        name,
        url_img
      );

      console.log("[WorkspaceController.create] workspace_created._id:", workspace_created._id);
      console.log("[WorkspaceController.create] Workspace creado exitosamente");

      response.status(201).json({
        status: 201,
        ok: true,
        message: "Workspace creado con exito",
        data: {
          workspace: {
            workspace_id: workspace_created._id.toString(),
            workspace_name: workspace_created.name,
            workspace_created_at: workspace_created.created_at,
            workspace_url_image: workspace_created.url_img
          }
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
        console.error("ERROR AL CREAR WORKSPACE", error);
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
