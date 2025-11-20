import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        url_img: {
            type: String,
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true
        },
        modified_at: {
            type: Date
        },
        active: {
            type: Boolean,
            default: true,
            required: true
        }
    }
)

const Workspace = mongoose.model('Workspace', workspaceSchema)

export default Workspace