import {
  isClientFeatureEnabled,
  isServerFeatureEnabled,
} from '@/flavours/glitch/utils/environment';

export function areCollectionsEnabled() {
  return (
    isClientFeatureEnabled('collections') &&
    isServerFeatureEnabled('collections')
  );
}
