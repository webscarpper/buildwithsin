#!/usr/bin/env python3
"""
Script to enable critical GOATA features.
Run this after deploying to enable agents and marketplace functionality.
"""

import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flags.flags import enable_flag
from services import redis
from utils.logger import logger

async def enable_features():
    """Enable critical GOATA features"""
    try:
        # Initialize Redis connection
        await redis.initialize_async()
        
        # Enable custom agents feature
        success1 = await enable_flag(
            "custom_agents", 
            "Enable custom agent creation, editing, and management"
        )
        
        # Enable agent marketplace feature  
        success2 = await enable_flag(
            "agent_marketplace",
            "Enable agent marketplace for sharing and discovering agents"
        )
        
        if success1 and success2:
            logger.info("✅ Successfully enabled all GOATA features!")
            print("✅ SUCCESS: Custom agents and marketplace are now enabled!")
            print("🔄 Your backend will automatically restart and agents should work now.")
        else:
            logger.error("❌ Failed to enable some features")
            print("❌ FAILED: Could not enable all features. Check Redis connection.")
            
    except Exception as e:
        logger.error(f"Error enabling features: {e}")
        print(f"❌ ERROR: {e}")
    finally:
        await redis.close()

if __name__ == "__main__":
    asyncio.run(enable_features())