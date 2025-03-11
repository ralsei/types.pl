import { apiRequestPut } from 'flavours/glitch/api';
import type { ApiMediaAttachmentJSON } from 'flavours/glitch/api_types/media_attachments';

export const apiUpdateMedia = (
  id: string,
  params?: { description?: string; focus?: string },
) => apiRequestPut<ApiMediaAttachmentJSON>(`v1/media/${id}`, params);
