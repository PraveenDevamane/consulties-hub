#!/bin/bash

# Test script to verify Supabase connection and seed data

echo "🔍 Checking environment variables..."

if [ -z "$SUPABASE_URL" ]; then
  echo "❌ SUPABASE_URL is not set"
  echo "Please set it: export SUPABASE_URL='https://your-project.supabase.co'"
  exit 1
else
  echo "✅ SUPABASE_URL is set: $SUPABASE_URL"
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY is not set"
  echo "Please set it: export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
  exit 1
else
  echo "✅ SUPABASE_SERVICE_ROLE_KEY is set (hidden for security)"
fi

echo ""
echo "🌱 Running seed script..."
echo ""

node scripts/seed-sample.mjs

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Seed script completed!"
else
  echo ""
  echo "❌ Seed script failed!"
  echo ""
  echo "Common issues:"
  echo "1. RLS policies blocking inserts - Run scripts/update-rls-policies.sql in Supabase"
  echo "2. Missing categories in database"
  echo "3. Invalid service role key"
fi
