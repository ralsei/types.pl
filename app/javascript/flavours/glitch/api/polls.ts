import { apiRequestGet, apiRequestPost } from 'flavours/glitch/api';
import type { ApiPollJSON } from 'flavours/glitch/api_types/polls';

export const apiGetPoll = (pollId: string) =>
  apiRequestGet<ApiPollJSON>(`/v1/polls/${pollId}`);

export const apiPollVote = (pollId: string, choices: string[]) =>
  apiRequestPost<ApiPollJSON>(`/v1/polls/${pollId}/votes`, {
    choices,
  });
