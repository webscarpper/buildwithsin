#!/usr/bin/env python3
"""
Helper script to find user ID by email address.
This makes it easier to identify users for the reset_user_usage script.

Usage:
    python backend/utils/scripts/find_user_by_email.py --email user@example.com
    python backend/utils/scripts/find_user_by_email.py --list-recent
"""

import asyncio
import argparse
import sys
import os
from datetime import datetime, timezone, timedelta

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from services.supabase import DBConnection
from utils.logger import logger

async def find_user_by_email(client, email: str):
    """Find user ID by email address."""
    print(f"\n🔍 Searching for user with email: {email}")
    print("=" * 60)
    
    try:
        # Search in auth.users for the email
        user_result = await client.auth.admin.list_users()
        
        found_user = None
        for user in user_result:
            if user.email and user.email.lower() == email.lower():
                found_user = user
                break
        
        if not found_user:
            print(f"❌ No user found with email: {email}")
            return None
        
        user_id = found_user.id
        print(f"✅ Found user:")
        print(f"   User ID: {user_id}")
        print(f"   Email: {found_user.email}")
        print(f"   Created: {found_user.created_at}")
        
        # Check if they have billing info
        billing_result = await client.schema('basejump').from_('billing_customers') \
            .select('id, active, provider') \
            .eq('account_id', user_id) \
            .execute()
        
        if billing_result.data:
            billing_info = billing_result.data[0]
            print(f"   Stripe Customer ID: {billing_info['id']}")
            print(f"   Billing Active: {billing_info['active']}")
            print(f"   Provider: {billing_info['provider']}")
        else:
            print("   No billing information found")
        
        # Check recent agent runs
        now = datetime.now(timezone.utc)
        start_of_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
        
        # Get user's threads
        threads_result = await client.table('threads') \
            .select('thread_id') \
            .eq('account_id', user_id) \
            .execute()
        
        if threads_result.data:
            thread_ids = [t['thread_id'] for t in threads_result.data]
            
            # Get agent runs this month
            runs_result = await client.table('agent_runs') \
                .select('id, status, started_at, completed_at') \
                .in_('thread_id', thread_ids) \
                .gte('started_at', start_of_month.isoformat()) \
                .execute()
            
            if runs_result.data:
                runs = runs_result.data
                completed_runs = [r for r in runs if r['status'] in ['completed', 'failed', 'stopped']]
                running_runs = [r for r in runs if r['status'] == 'running']
                
                print(f"   Agent Runs This Month: {len(runs)} total")
                print(f"   - Completed: {len(completed_runs)}")
                print(f"   - Still Running: {len(running_runs)}")
                
                if running_runs:
                    print("   ⚠️  WARNING: User has running agent runs")
        
        print(f"\n📝 To reset this user's usage, run:")
        print(f"   python backend/utils/scripts/reset_user_usage.py --user-id {user_id} --action show")
        
        return user_id
        
    except Exception as e:
        print(f"❌ Error searching for user: {e}")
        return None

async def list_recent_users(client):
    """List users who have been active recently."""
    print(f"\n📋 Recent Active Users (Last 7 Days)")
    print("=" * 60)
    
    try:
        # Get users who have created threads in the last 7 days
        now = datetime.now(timezone.utc)
        week_ago = now - timedelta(days=7)
        
        recent_threads = await client.table('threads') \
            .select('account_id, created_at') \
            .gte('created_at', week_ago.isoformat()) \
            .order('created_at', desc=True) \
            .execute()
        
        if not recent_threads.data:
            print("No recent activity found.")
            return
        
        # Get unique user IDs
        user_ids = list(set([t['account_id'] for t in recent_threads.data]))
        print(f"Found {len(user_ids)} unique users with recent activity:")
        
        # Get user details for each
        for user_id in user_ids[:10]:  # Limit to first 10
            try:
                user_result = await client.auth.admin.get_user_by_id(user_id)
                if user_result and user_result.user:
                    email = user_result.user.email or "No email"
                    created = user_result.user.created_at[:10] if user_result.user.created_at else "Unknown"
                    print(f"   📧 {email}")
                    print(f"      User ID: {user_id}")
                    print(f"      Created: {created}")
                    print("")
            except Exception as e:
                print(f"   ❌ Error getting details for user {user_id}: {e}")
        
        if len(user_ids) > 10:
            print(f"   ... and {len(user_ids) - 10} more users")
            
    except Exception as e:
        print(f"❌ Error listing recent users: {e}")

async def main():
    parser = argparse.ArgumentParser(description='Find user ID by email for usage reset')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--email', help='Email address to search for')
    group.add_argument('--list-recent', action='store_true', help='List recent active users')
    
    args = parser.parse_args()
    
    try:
        # Initialize database connection
        db = DBConnection()
        client = await db.client
        
        if args.email:
            await find_user_by_email(client, args.email)
        elif args.list_recent:
            await list_recent_users(client)
        
    except Exception as e:
        logger.error(f"Error in find_user_by_email script: {e}")
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())