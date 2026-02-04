/**
 * useCoachNotes Hook
 *
 * Manages coach notes display and dismissal
 */

import { useCallback, useMemo } from 'react';
import { useCoachNotes as useCoachNotesStore, useActiveCoachNote } from '@/stores';
import { useProgressStore } from '@/stores/progress';

export function useCoachNotes() {
  const notes = useCoachNotesStore();
  const activeNote = useActiveCoachNote();
  const dismissNote = useProgressStore((s) => s.dismissCoachNote);

  const dismiss = useCallback(
    async (noteId: string) => {
      await dismissNote(noteId);
    },
    [dismissNote]
  );

  return useMemo(
    () => ({
      notes,
      activeNote,
      dismiss,
      hasNotes: notes.length > 0,
    }),
    [notes, activeNote, dismiss]
  );
}

/**
 * Get notes filtered by location
 */
export function useCoachNotesByLocation(location: 'home' | 'workout' | 'progress' | 'chat') {
  const notes = useCoachNotesStore();

  return useMemo(
    () => notes.filter((note) => note.display_location?.includes(location)),
    [notes, location]
  );
}
