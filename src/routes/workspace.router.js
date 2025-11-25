import express from 'express'
import WorkspaceRepository from '../repositories/workspace.repository.js'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import workspaceMiddleware from '../middlewares/workspace.middleware.js'
import channelMiddleware from '../middlewares/channel.middleware.js'
import ChannelController from '../controllers/channel.controller.js'
import MessagesController from '../controllers/message.controller.js'

const workspaceRouter = express.Router()
workspaceRouter.get(
    '/',
    authMiddleware,
    WorkspaceController.getAll
)


workspaceRouter.post(
    '/',
    authMiddleware,
    WorkspaceController.create
)

workspaceRouter.delete(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.delete
)

workspaceRouter.get(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(),
    WorkspaceController.getById
)

workspaceRouter.get(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(),
    WorkspaceController.getById
)

workspaceRouter.post(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['admin']), 
    ChannelController.create
)

workspaceRouter.delete(
    '/:workspace_id/channels/:channel_id',
    authMiddleware,
    workspaceMiddleware(['admin']),
    channelMiddleware,
    ChannelController.delete
)

workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.create
)

workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.getAllByChannelId
)

workspaceRouter.delete(
    '/:workspace_id/channels/:channel_id/messages/:message_id',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.delete
)

workspaceRouter.post(
    '/:workspace_id/invite', 
    authMiddleware, 
    workspaceMiddleware(['admin']), 
    WorkspaceController.invite
)

export default workspaceRouter