import CommentAttachmentBitrix from "./bitrix/commentAttachmentBitrix";

export default interface ComentarioBitrix {
   POST_MESSAGE_HTML: string;
   ID: string;
   AUTHOR_ID: string; 
   AUTHOR_NAME: string; 
   AUTHOR_EMAIL: string; 
   POST_DATE: string; 
   POST_MESSAGE: string; 
   ATTACHED_OBJECTS: CommentAttachmentBitrix[]
}
