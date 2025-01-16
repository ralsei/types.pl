import { apiRequestGet } from 'flavours/glitch/api';
import type {
  ApiTermsOfServiceJSON,
  ApiPrivacyPolicyJSON,
} from 'flavours/glitch/api_types/instance';

export const apiGetTermsOfService = () =>
  apiRequestGet<ApiTermsOfServiceJSON>('v1/instance/terms_of_service');

export const apiGetPrivacyPolicy = () =>
  apiRequestGet<ApiPrivacyPolicyJSON>('v1/instance/privacy_policy');
