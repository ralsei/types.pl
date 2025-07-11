import { apiRequestGet } from 'flavours/glitch/api';
import type { ApiContextJSON } from 'flavours/glitch/api_types/statuses';

export const apiGetContext = (statusId: string) =>
  apiRequestGet<ApiContextJSON>(`v1/statuses/${statusId}/context`);
