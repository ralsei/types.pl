import { useState, useCallback, useMemo } from 'react';

import { useIntl, defineMessages } from 'react-intl';

import type {
  List,
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';

import type {
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
  Announcements,
  ScreenReaderInstructions,
} from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { changeMediaOrder } from 'flavours/glitch/actions/compose';
import type { MediaAttachment } from 'flavours/glitch/models/media_attachment';
import { useAppSelector, useAppDispatch } from 'flavours/glitch/store';

import { SensitiveButton } from './sensitive_button';
import { Upload } from './upload';
import { UploadProgress } from './upload_progress';

const messages = defineMessages({
  screenReaderInstructions: {
    id: 'upload_form.drag_and_drop.instructions',
    defaultMessage:
      'To pick up a media attachment, press space or enter. While dragging, use the arrow keys to move the media attachment in any given direction. Press space or enter again to drop the media attachment in its new position, or press escape to cancel.',
  },
  onDragStart: {
    id: 'upload_form.drag_and_drop.on_drag_start',
    defaultMessage: 'Picked up media attachment {item}.',
  },
  onDragOver: {
    id: 'upload_form.drag_and_drop.on_drag_over',
    defaultMessage: 'Media attachment {item} was moved.',
  },
  onDragEnd: {
    id: 'upload_form.drag_and_drop.on_drag_end',
    defaultMessage: 'Media attachment {item} was dropped.',
  },
  onDragCancel: {
    id: 'upload_form.drag_and_drop.on_drag_cancel',
    defaultMessage:
      'Dragging was cancelled. Media attachment {item} was dropped.',
  },
});

export const UploadForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const mediaIds = useAppSelector(
    (state) =>
      (
        (state.compose as ImmutableMap<string, unknown>).get(
          'media_attachments',
        ) as ImmutableList<MediaAttachment>
      ).map((item: MediaAttachment) => item.get('id')) as List<string>,
  );
  const active = useAppSelector(
    (state) => state.compose.get('is_uploading') as boolean,
  );
  const progress = useAppSelector(
    (state) => state.compose.get('progress') as number,
  );
  const isProcessing = useAppSelector(
    (state) => state.compose.get('is_processing') as boolean,
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(
    (e: DragStartEvent) => {
      const { active } = e;

      setActiveId(active.id);
    },
    [setActiveId],
  );

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;

      if (over && active.id !== over.id) {
        dispatch(changeMediaOrder(active.id, over.id));
      }

      setActiveId(null);
    },
    [dispatch, setActiveId],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, [setActiveId]);

  const accessibility: {
    screenReaderInstructions: ScreenReaderInstructions;
    announcements: Announcements;
  } = useMemo(
    () => ({
      screenReaderInstructions: {
        draggable: intl.formatMessage(messages.screenReaderInstructions),
      },

      announcements: {
        onDragStart({ active }) {
          return intl.formatMessage(messages.onDragStart, { item: active.id });
        },

        onDragOver({ active }) {
          return intl.formatMessage(messages.onDragOver, { item: active.id });
        },

        onDragEnd({ active }) {
          return intl.formatMessage(messages.onDragEnd, { item: active.id });
        },

        onDragCancel({ active }) {
          return intl.formatMessage(messages.onDragCancel, { item: active.id });
        },
      },
    }),
    [intl],
  );

  return (
    <>
      <UploadProgress
        active={active}
        progress={progress}
        isProcessing={isProcessing}
      />

      {mediaIds.size > 0 && (
        <div
          className={`compose-form__uploads media-gallery media-gallery--layout-${mediaIds.size}`}
        >
          {mediaIds.size === 1 ? (
            <Upload
              id={mediaIds.first()}
              dragging={false}
              draggable={false}
              tall
              wide
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
              onDragAbort={handleDragCancel}
              accessibility={accessibility}
            >
              <SortableContext
                items={mediaIds.toArray()}
                strategy={rectSortingStrategy}
              >
                {mediaIds.map((id, idx) => (
                  <Upload
                    key={id}
                    id={id}
                    dragging={id === activeId}
                    tall={
                      mediaIds.size < 3 || (mediaIds.size === 3 && idx === 0)
                    }
                    wide={mediaIds.size === 1}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeId ? <Upload id={activeId as string} overlay /> : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      )}

      {!mediaIds.isEmpty() && <SensitiveButton />}
    </>
  );
};
