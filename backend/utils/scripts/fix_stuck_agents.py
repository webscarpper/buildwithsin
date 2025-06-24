#!/usr/bin/env python3
"""
Script to identify and fix stuck agent runs in the GOATA application.
This script should be run manually to clean up existing stuck runs.
"""

import asyncio
import sys
import os
from datetime import datetime, timezone

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from services.supabase import DBConnection
from utils.logger import logger

async def fix_stuck_agent_runs():
    """Find and fix stuck agent runs that have been running for more than 1 hour."""
    
    logger.info("🔍 Starting stuck agent run cleanup...")
    
    try:
        # Initialize database connection
        db = DBConnection()
        await db.initialize()
        client = await db.client
        
        # Get current time
        now = datetime.now(timezone.utc)
        one_hour_ago = datetime.now(timezone.utc).replace(
            hour=now.hour-1 if now.hour > 0 else 23,
            minute=now.minute,
            second=now.second,
            microsecond=now.microsecond
        )
        
        # Find agent runs that are still "running" but started more than 1 hour ago
        stuck_runs_result = await client.table('agent_runs').select('id, started_at, thread_id').eq('status', 'running').lt('started_at', one_hour_ago.isoformat()).execute()
        
        if not stuck_runs_result.data:
            logger.info("✅ No stuck agent runs found.")
            return
        
        stuck_runs = stuck_runs_result.data
        logger.info(f"🚨 Found {len(stuck_runs)} stuck agent runs")
        
        # Update each stuck run
        updated_count = 0
        for run in stuck_runs:
            run_id = run['id']
            started_at = run['started_at']
            thread_id = run['thread_id']
            
            try:
                # Calculate how long it's been running
                start_time = datetime.fromisoformat(started_at.replace('Z', '+00:00'))
                duration = (now - start_time).total_seconds() / 60  # minutes
                
                logger.info(f"  📝 Fixing stuck run {run_id} (running for {duration:.1f} minutes)")
                
                # Update the agent run to mark it as failed
                update_result = await client.table('agent_runs').update({
                    'status': 'failed',
                    'completed_at': now.isoformat(),
                    'error': f'Agent run was stuck and automatically cleaned up after {duration:.1f} minutes. This typically happens due to timeout or system errors.'
                }).eq('id', run_id).execute()
                
                if update_result.data:
                    updated_count += 1
                    logger.info(f"  ✅ Updated stuck run {run_id}")
                else:
                    logger.warning(f"  ⚠️ Failed to update stuck run {run_id}")
                    
            except Exception as e:
                logger.error(f"  ❌ Error updating stuck run {run_id}: {e}")
        
        logger.info(f"🎉 Successfully updated {updated_count}/{len(stuck_runs)} stuck agent runs")
        
        # Show summary of usage impact
        logger.info("📊 Usage Impact Summary:")
        logger.info("  - Stuck runs will no longer count toward user usage limits")
        logger.info("  - Future usage calculations will be more accurate")
        logger.info("  - Users affected by this issue should see correct usage within 24 hours")
        
    except Exception as e:
        logger.error(f"❌ Error during stuck agent run cleanup: {e}")
        raise
    finally:
        # Clean up database connection
        try:
            await db.disconnect()
        except:
            pass

async def show_usage_stats():
    """Show current usage statistics to verify the fix."""
    
    logger.info("📊 Generating usage statistics...")
    
    try:
        db = DBConnection()
        await db.initialize()
        client = await db.client
        
        # Get current month's data
        now = datetime.now(timezone.utc)
        start_of_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
        
        # Get all agent runs from this month
        runs_result = await client.table('agent_runs').select('id, status, started_at, completed_at').gte('started_at', start_of_month.isoformat()).execute()
        
        if not runs_result.data:
            logger.info("No agent runs found for this month.")
            return
        
        total_runs = len(runs_result.data)
        completed_runs = len([r for r in runs_result.data if r['status'] in ['completed', 'failed', 'stopped']])
        running_runs = len([r for r in runs_result.data if r['status'] == 'running'])
        
        logger.info(f"Current Month Statistics:")
        logger.info(f"  Total Runs: {total_runs}")
        logger.info(f"  Completed/Failed/Stopped: {completed_runs}")
        logger.info(f"  Still Running: {running_runs}")
        
        if running_runs > 0:
            logger.warning(f"⚠️  {running_runs} runs are still marked as 'running' - these may be active or stuck")
            
        # Calculate total usage for completed runs
        total_seconds = 0
        for run in runs_result.data:
            if run['completed_at'] and run['status'] in ['completed', 'failed', 'stopped']:
                start_time = datetime.fromisoformat(run['started_at'].replace('Z', '+00:00')).timestamp()
                end_time = datetime.fromisoformat(run['completed_at'].replace('Z', '+00:00')).timestamp()
                duration = end_time - start_time
                if duration > 0 and duration < 14400:  # Reasonable duration (under 4 hours)
                    total_seconds += duration
        
        total_minutes = total_seconds / 60
        logger.info(f"  Total Billable Usage This Month: {total_minutes:.2f} minutes ({total_minutes/60:.2f} hours)")
        
    except Exception as e:
        logger.error(f"Error generating usage stats: {e}")
    finally:
        try:
            await db.disconnect()
        except:
            pass

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Fix stuck agent runs and show usage statistics')
    parser.add_argument('--fix', action='store_true', help='Fix stuck agent runs')
    parser.add_argument('--stats', action='store_true', help='Show usage statistics')
    parser.add_argument('--all', action='store_true', help='Run both fix and stats')
    
    args = parser.parse_args()
    
    if not any([args.fix, args.stats, args.all]):
        parser.print_help()
        sys.exit(1)
    
    async def main():
        if args.fix or args.all:
            await fix_stuck_agent_runs()
            print()
        
        if args.stats or args.all:
            await show_usage_stats()
    
    # Run the async function
    asyncio.run(main())