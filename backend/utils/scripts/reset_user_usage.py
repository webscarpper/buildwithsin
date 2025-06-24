#!/usr/bin/env python3
"""
Script to reset a user's monthly usage by fixing problematic agent runs.
Use this for users affected by the usage calculation bug.

Usage:
    python backend/utils/scripts/reset_user_usage.py --user-id USER_ID --action [show|reset|grant-bonus]
    
Examples:
    # Show current usage for a user
    python backend/utils/scripts/reset_user_usage.py --user-id abc123 --action show
    
    # Reset user's problematic runs this month
    python backend/utils/scripts/reset_user_usage.py --user-id abc123 --action reset
    
    # Grant bonus minutes (temporarily increase their limit)
    python backend/utils/scripts/reset_user_usage.py --user-id abc123 --action grant-bonus --bonus-minutes 120
"""

import asyncio
import argparse
import sys
import os
from datetime import datetime, timezone
from typing import List, Dict, Optional

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from services.supabase import DBConnection
from services.billing import calculate_monthly_usage, get_user_subscription, SUBSCRIPTION_TIERS
from utils.logger import logger
from utils.config import config

async def get_user_threads(client, user_id: str) -> List[str]:
    """Get all thread IDs for a user."""
    result = await client.table('threads') \
        .select('thread_id') \
        .eq('account_id', user_id) \
        .execute()
    
    return [t['thread_id'] for t in result.data] if result.data else []

async def get_user_agent_runs_this_month(client, user_id: str) -> List[Dict]:
    """Get all agent runs for a user this month."""
    # Get start of current month in UTC
    now = datetime.now(timezone.utc)
    start_of_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
    
    # Get user's threads
    thread_ids = await get_user_threads(client, user_id)
    if not thread_ids:
        return []
    
    # Get all agent runs for these threads in current month
    result = await client.table('agent_runs') \
        .select('id, thread_id, started_at, completed_at, status, error') \
        .in_('thread_id', thread_ids) \
        .gte('started_at', start_of_month.isoformat()) \
        .order('started_at', desc=True) \
        .execute()
    
    return result.data if result.data else []

async def show_user_usage(client, user_id: str):
    """Show current usage and problematic runs for a user."""
    print(f"\n📊 Usage Analysis for User: {user_id}")
    print("=" * 60)
    
    # Get current subscription
    subscription = await get_user_subscription(user_id)
    if subscription:
        # Extract price ID
        price_id = None
        if subscription.get('items') and subscription['items'].get('data'):
            price_id = subscription['items']['data'][0]['price']['id']
        tier_info = SUBSCRIPTION_TIERS.get(price_id, {'name': 'unknown', 'minutes': 0})
        print(f"📋 Subscription: {tier_info['name']} ({tier_info['minutes']} minutes/month)")
    else:
        tier_info = SUBSCRIPTION_TIERS[config.STRIPE_FREE_TIER_ID]
        print(f"📋 Subscription: Free tier ({tier_info['minutes']} minutes/month)")
    
    # Calculate current usage
    current_usage = await calculate_monthly_usage(client, user_id)
    print(f"⏱️  Current Usage: {current_usage:.2f} minutes")
    print(f"📈 Limit Status: {current_usage:.2f}/{tier_info['minutes']} minutes ({(current_usage/tier_info['minutes']*100):.1f}%)")
    
    # Get all runs this month
    runs = await get_user_agent_runs_this_month(client, user_id)
    print(f"\n🔍 Agent Runs This Month: {len(runs)} total")
    
    if not runs:
        print("   No agent runs found this month.")
        return
    
    # Analyze runs
    now_ts = datetime.now(timezone.utc).timestamp()
    problematic_runs = []
    normal_runs = []
    stuck_runs = []
    
    for run in runs:
        run_id = run['id']
        status = run['status']
        started_at = datetime.fromisoformat(run['started_at'].replace('Z', '+00:00')).timestamp()
        
        if run['completed_at'] and status in ['completed', 'failed', 'stopped']:
            # Completed run
            completed_at = datetime.fromisoformat(run['completed_at'].replace('Z', '+00:00')).timestamp()
            duration_minutes = (completed_at - started_at) / 60
            
            if duration_minutes > 240:  # More than 4 hours
                problematic_runs.append({
                    'id': run_id,
                    'status': status,
                    'duration_minutes': duration_minutes,
                    'reason': 'Excessive duration (>4 hours)',
                    'started_at': run['started_at']
                })
            else:
                normal_runs.append({
                    'id': run_id,
                    'status': status,
                    'duration_minutes': duration_minutes
                })
        elif status == 'running':
            # Running job - check if stuck
            time_since_start = (now_ts - started_at) / 60  # minutes
            
            if time_since_start > 60:  # More than 1 hour
                stuck_runs.append({
                    'id': run_id,
                    'status': status,
                    'duration_minutes': time_since_start,
                    'reason': 'Stuck in running state (>1 hour)',
                    'started_at': run['started_at']
                })
            else:
                normal_runs.append({
                    'id': run_id,
                    'status': status,
                    'duration_minutes': time_since_start
                })
    
    print(f"\n✅ Normal Runs: {len(normal_runs)}")
    if normal_runs:
        total_normal_minutes = sum(r['duration_minutes'] for r in normal_runs)
        print(f"   Total Duration: {total_normal_minutes:.2f} minutes")
    
    print(f"\n⚠️  Problematic Runs: {len(problematic_runs)}")
    if problematic_runs:
        total_problematic_minutes = sum(r['duration_minutes'] for r in problematic_runs)
        print(f"   Total Duration: {total_problematic_minutes:.2f} minutes")
        for run in problematic_runs[:5]:  # Show first 5
            print(f"   - {run['id']}: {run['duration_minutes']:.1f}min ({run['reason']})")
        if len(problematic_runs) > 5:
            print(f"   ... and {len(problematic_runs) - 5} more")
    
    print(f"\n🚫 Stuck Runs: {len(stuck_runs)}")
    if stuck_runs:
        total_stuck_minutes = sum(r['duration_minutes'] for r in stuck_runs)
        print(f"   Total Duration: {total_stuck_minutes:.2f} minutes")
        for run in stuck_runs[:5]:  # Show first 5
            print(f"   - {run['id']}: {run['duration_minutes']:.1f}min ({run['reason']})")
        if len(stuck_runs) > 5:
            print(f"   ... and {len(stuck_runs) - 5} more")

async def reset_user_usage(client, user_id: str):
    """Reset user's problematic runs this month."""
    print(f"\n🔧 Resetting Usage for User: {user_id}")
    print("=" * 60)
    
    # Get all runs this month
    runs = await get_user_agent_runs_this_month(client, user_id)
    if not runs:
        print("No agent runs found this month.")
        return
    
    # Find problematic runs
    now_ts = datetime.now(timezone.utc).timestamp()
    runs_to_fix = []
    
    for run in runs:
        run_id = run['id']
        status = run['status']
        started_at = datetime.fromisoformat(run['started_at'].replace('Z', '+00:00')).timestamp()
        
        if run['completed_at'] and status in ['completed', 'failed', 'stopped']:
            # Check for excessive duration
            completed_at = datetime.fromisoformat(run['completed_at'].replace('Z', '+00:00')).timestamp()
            duration_minutes = (completed_at - started_at) / 60
            
            if duration_minutes > 240:  # More than 4 hours
                runs_to_fix.append({
                    'id': run_id,
                    'action': 'mark_failed',
                    'reason': f'Excessive duration: {duration_minutes:.1f} minutes'
                })
        elif status == 'running':
            # Check for stuck runs
            time_since_start = (now_ts - started_at) / 60  # minutes
            
            if time_since_start > 60:  # More than 1 hour
                runs_to_fix.append({
                    'id': run_id,
                    'action': 'mark_failed',
                    'reason': f'Stuck in running state: {time_since_start:.1f} minutes'
                })
    
    if not runs_to_fix:
        print("✅ No problematic runs found to fix.")
        return
    
    print(f"Found {len(runs_to_fix)} problematic runs to fix:")
    for run in runs_to_fix:
        print(f"  - {run['id']}: {run['reason']}")
    
    # Ask for confirmation
    response = input(f"\nDo you want to mark these {len(runs_to_fix)} runs as failed? (y/N): ")
    if response.lower() != 'y':
        print("Operation cancelled.")
        return
    
    # Mark runs as failed
    now = datetime.now(timezone.utc)
    run_ids = [run['id'] for run in runs_to_fix]
    
    try:
        result = await client.table('agent_runs').update({
            'status': 'failed',
            'completed_at': now.isoformat(),
            'error': 'Marked as failed during usage reset - was problematic run'
        }).in_('id', run_ids).execute()
        
        print(f"✅ Successfully marked {len(run_ids)} runs as failed.")
        
        # Recalculate usage
        new_usage = await calculate_monthly_usage(client, user_id)
        print(f"📊 New usage calculation: {new_usage:.2f} minutes")
        
    except Exception as e:
        print(f"❌ Error updating runs: {e}")

async def grant_bonus_minutes(client, user_id: str, bonus_minutes: int):
    """Grant bonus minutes by creating a temporary subscription entry."""
    print(f"\n🎁 Granting {bonus_minutes} Bonus Minutes to User: {user_id}")
    print("=" * 60)
    
    # Check if user already has a manual subscription
    existing = await client.schema('basejump').from_('billing_subscriptions') \
        .select('*') \
        .eq('account_id', user_id) \
        .eq('status', 'active') \
        .execute()
    
    if existing.data:
        print("❌ User already has a manual subscription. Cannot grant bonus minutes.")
        return
    
    # Create a temporary bonus subscription
    try:
        result = await client.schema('basejump').from_('billing_subscriptions').insert({
            'account_id': user_id,
            'status': 'active',
            'plan_name': f'bonus_{bonus_minutes}_minutes',
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat()
        }).execute()
        
        print(f"✅ Successfully granted {bonus_minutes} bonus minutes.")
        print(f"📝 Created manual subscription with plan: bonus_{bonus_minutes}_minutes")
        print(f"⚠️  Note: This gives unlimited usage. Remove manually when appropriate.")
        
    except Exception as e:
        print(f"❌ Error creating bonus subscription: {e}")

async def main():
    parser = argparse.ArgumentParser(description='Reset user usage affected by billing bug')
    parser.add_argument('--user-id', required=True, help='User ID to reset usage for')
    parser.add_argument('--action', required=True, choices=['show', 'reset', 'grant-bonus'], 
                       help='Action to perform')
    parser.add_argument('--bonus-minutes', type=int, default=120,
                       help='Bonus minutes to grant (default: 120)')
    
    args = parser.parse_args()
    
    try:
        # Initialize database connection
        db = DBConnection()
        client = await db.client
        
        if args.action == 'show':
            await show_user_usage(client, args.user_id)
        elif args.action == 'reset':
            await show_user_usage(client, args.user_id)
            await reset_user_usage(client, args.user_id)
        elif args.action == 'grant-bonus':
            await show_user_usage(client, args.user_id)
            await grant_bonus_minutes(client, args.user_id, args.bonus_minutes)
        
        print(f"\n✅ Operation completed for user {args.user_id}")
        
    except Exception as e:
        logger.error(f"Error in reset_user_usage script: {e}")
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())