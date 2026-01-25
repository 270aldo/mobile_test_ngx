-- Migration: Create messages table
-- Chat messages with GENESIS and coach

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  role TEXT CHECK (role IN ('user', 'genesis', 'coach')) NOT NULL,
  content TEXT NOT NULL,

  -- Message type
  message_type TEXT CHECK (message_type IN ('text', 'voice', 'image', 'workout_summary', 'checkin_summary')) DEFAULT 'text',

  -- Attachments
  attachments JSONB, -- [{type: 'image', url: '...'}, {type: 'workout', id: '...'}]

  -- For coach messages
  is_coach_note BOOLEAN DEFAULT FALSE, -- Show in special mint card
  coach_note_priority TEXT CHECK (coach_note_priority IN ('info', 'action', 'celebration')),
  coach_note_expires_at TIMESTAMPTZ,

  -- Read status
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND role = 'user');

-- Index for chat retrieval
CREATE INDEX messages_user_created_idx ON public.messages(user_id, created_at DESC);
