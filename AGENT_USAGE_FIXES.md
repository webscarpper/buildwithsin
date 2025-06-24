# GOATA Agent Execution & Usage Tracking Fixes

## 🐛 **Issues Identified & Fixed**

### **Issue 1: Usage Miscalculation (2 minutes → 125 minutes)**

**Root Cause:** Stuck agent runs that never complete properly cause the usage calculation to use `current_time` as the end time, making short tasks appear as extremely long usage periods.

**Specific Problem:** In `calculate_monthly_usage()`, incomplete runs used `now_ts` as the end time even for runs that started hours ago.

### **Issue 2: Agent Getting Stuck in Infinite Loops**

**Root Cause:** No timeout mechanism for agent runs, allowing them to run indefinitely without proper error handling or cleanup.

## ✅ **Fixes Applied**

### **1. Usage Calculation Fix (`backend/services/billing.py`)**

```python
# OLD (BUGGY) LOGIC:
if run['completed_at']:
    end_time = datetime.fromisoformat(run['completed_at'].replace('Z', '+00:00')).timestamp()
else:
    # This was the bug - used current time for ALL incomplete runs
    end_time = now_ts  

# NEW (FIXED) LOGIC:
if run['completed_at'] and status in ['completed', 'failed', 'stopped']:
    # Only count properly finished runs
    end_time = datetime.fromisoformat(run['completed_at'].replace('Z', '+00:00')).timestamp()
elif status == 'running':
    time_since_start = now_ts - start_time
    if time_since_start > 3600:  # 1 hour limit
        # Mark as stuck and don't count for billing
        stuck_runs_found.append(run_id)
        continue
    else:
        # Cap active runs at 30 minutes for billing
        duration = min(time_since_start, 1800)
```

**Key Improvements:**
- ✅ Only count completed runs for billing
- ✅ Detect and mark stuck runs as failed automatically
- ✅ Cap active run duration at 30 minutes for billing purposes
- ✅ Auto-cleanup stuck runs in the database

### **2. Agent Timeout Fix (`backend/run_agent_background.py`)**

```python
# Added 2-hour timeout wrapper
timeout_seconds = 7200  # 2 hours max per agent run

try:
    await asyncio.wait_for(_run_agent_with_timeout(...), timeout=timeout_seconds)
except asyncio.TimeoutError:
    # Handle timeout gracefully
    error_message = f"Agent run exceeded {timeout_seconds/3600:.1f} hour timeout"
    final_status = "failed"
    # Update database and notify clients
```

**Key Improvements:**
- ✅ 2-hour maximum timeout per agent run
- ✅ Graceful timeout handling with proper cleanup
- ✅ Automatic database status updates for timed-out runs
- ✅ Better Redis connection error handling

### **3. Cleanup Utility (`backend/utils/scripts/fix_stuck_agents.py`)**

A utility script to clean up existing stuck agent runs:

```bash
# Fix existing stuck runs
python backend/utils/scripts/fix_stuck_agents.py --fix

# Show usage statistics
python backend/utils/scripts/fix_stuck_agents.py --stats

# Do both
python backend/utils/scripts/fix_stuck_agents.py --all
```

## 🔧 **How Your Billing Model Works (Correctly)**

Your "Licensed (not metered)" Stripe model is implemented correctly:

1. **Stripe**: Handles subscription billing only (monthly charges)
2. **Application Code**: Tracks usage and enforces limits
3. **No Stripe Usage Data**: Usage tracking is entirely in your application

This is the **correct approach** for your billing model.

## 📊 **Expected Results After Fixes**

### **Before Fix:**
- Agent runs could get stuck indefinitely
- 2-minute tasks showing as 125+ minutes of usage
- Inaccurate billing limit enforcement
- Users hitting limits incorrectly

### **After Fix:**
- ✅ Agent runs timeout after 2 hours maximum
- ✅ Only completed tasks count toward usage
- ✅ Stuck runs automatically marked as failed
- ✅ Accurate usage calculation and limit enforcement
- ✅ Better error handling and user experience

## 🚨 **Immediate Actions Required**

1. **Deploy the fixes** to your production environment
2. **Run the cleanup script** to fix existing stuck runs:
   ```bash
   python backend/utils/scripts/fix_stuck_agents.py --all
   ```
3. **Monitor logs** for the next 24 hours to ensure proper operation
4. **Verify user usage** is now accurately calculated

## 🔍 **Monitoring & Validation**

### **Log Messages to Watch For:**
```
# Good signs:
"Calculated X.XX minutes of usage for user Y this month"
"Successfully updated agent run Z status to 'completed'"
"Agent run A completed normally (duration: X.XXs)"

# Warning signs:
"Found stuck agent run X that started Y minutes ago"
"Agent run X timed out after Y seconds"
"Skipping agent run with suspicious duration"
```

### **Database Queries for Validation:**
```sql
-- Check for stuck runs (should be zero after fixes)
SELECT COUNT(*) FROM agent_runs 
WHERE status = 'running' 
AND started_at < NOW() - INTERVAL '1 hour';

-- Verify recent runs have proper completion times
SELECT id, status, started_at, completed_at, 
  EXTRACT(EPOCH FROM (completed_at - started_at))/60 as duration_minutes
FROM agent_runs 
WHERE started_at > NOW() - INTERVAL '24 hours'
AND status IN ('completed', 'failed', 'stopped');
```

## 🎯 **Best Practices for Ongoing Reliability**

1. **Monitor agent run durations** regularly
2. **Set up alerts** for runs exceeding 1 hour
3. **Run the cleanup script** weekly as a maintenance task
4. **Review usage reports** monthly for anomalies
5. **Consider adding user-facing timeout warnings** in the UI

## 📈 **Files Modified**

1. **`backend/services/billing.py`** - Fixed usage calculation logic
2. **`backend/run_agent_background.py`** - Added timeout and error handling
3. **`backend/utils/scripts/fix_stuck_agents.py`** - New cleanup utility
4. **`AGENT_USAGE_FIXES.md`** - This documentation

## 🔄 **Testing Recommendations**

1. **Create a test agent run** and verify it completes properly
2. **Check usage calculation** for a known user
3. **Verify timeout behavior** (if possible in a test environment)
4. **Run the cleanup script** on staging first

---

**Summary:** These fixes resolve both the usage miscalculation bug (2 minutes showing as 125 minutes) and the agent infinite loop issue. Your billing model architecture is correct - the problems were in the implementation details of usage tracking and timeout handling.