#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    if (!key || process.env[key] != null) continue;
    let value = line.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

async function ensureSeedUser() {
  const projectRoot = process.cwd();
  loadEnvFile(path.join(projectRoot, '.env'));

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const email = process.env.SEED_TEST_EMAIL ?? 'test+ngx@ngx.local';
  const password = process.env.SEED_TEST_PASSWORD ?? 'Test123456!';
  const fullName = process.env.SEED_TEST_FULL_NAME ?? 'NGX Test User';

  if (!supabaseUrl || !anonKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in environment.'
    );
  }

  const client = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let session = null;

  const signInAttempt = await client.auth.signInWithPassword({ email, password });
  if (!signInAttempt.error && signInAttempt.data.session) {
    session = signInAttempt.data.session;
    console.log('Seed user already exists. Signed in successfully.');
  } else {
    const shouldUseAdminCreate =
      serviceRoleKey &&
      (
        signInAttempt.error?.message?.toLowerCase().includes('invalid login credentials') ||
        signInAttempt.error?.message?.toLowerCase().includes('email not confirmed') ||
        signInAttempt.error?.message?.toLowerCase().includes('invalid credentials')
      );

    if (shouldUseAdminCreate) {
      const admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const createRes = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, onboarding_completed: true },
      });

      if (createRes.error && !createRes.error.message.toLowerCase().includes('already')) {
        throw createRes.error;
      }

      const retrySignIn = await client.auth.signInWithPassword({ email, password });
      if (retrySignIn.error || !retrySignIn.data.session) {
        throw retrySignIn.error ?? new Error('Unable to sign in seed user after admin create.');
      }
      session = retrySignIn.data.session;
      console.log('Seed user created via admin API.');
    } else {
      const signUpAttempt = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            onboarding_completed: true,
          },
        },
      });

      if (signUpAttempt.error) {
        throw signUpAttempt.error;
      }

      if (signUpAttempt.data.session) {
        session = signUpAttempt.data.session;
        console.log('Seed user created via signUp with active session.');
      } else {
        const retrySignIn = await client.auth.signInWithPassword({ email, password });
        if (retrySignIn.error || !retrySignIn.data.session) {
          throw new Error(
            'Seed user created but no session available. Check email confirmation policy in Supabase.'
          );
        }
        session = retrySignIn.data.session;
        console.log('Seed user existed or was confirmed, signed in successfully.');
      }
    }
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  });

  const currentUser = session.user;
  const profileUpsert = await authClient
    .from('profiles')
    .upsert(
      {
        id: currentUser.id,
        email,
        full_name: fullName,
        onboarding_completed: true,
      },
      { onConflict: 'id' }
    )
    .select('id, email, onboarding_completed')
    .single();

  if (profileUpsert.error) {
    throw profileUpsert.error;
  }

  const updateAuthUser = await authClient.auth.updateUser({
    data: {
      full_name: fullName,
      onboarding_completed: true,
    },
  });

  if (updateAuthUser.error) {
    throw updateAuthUser.error;
  }

  console.log('\nSeed user ready for normal login:');
  console.log(`EMAIL=${email}`);
  console.log(`PASSWORD=${password}`);
}

ensureSeedUser().catch((error) => {
  console.error('\nFailed to seed test user.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
