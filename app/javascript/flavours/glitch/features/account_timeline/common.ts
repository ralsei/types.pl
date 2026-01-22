import { isClientFeatureEnabled } from '@/flavours/glitch/utils/environment';

export function isRedesignEnabled() {
  return isClientFeatureEnabled('profile_redesign');
}
