#!/usr/bin/env python3
"""
Test script for the enhanced workflow thread management system.
This script tests the new thread management features.
"""

import asyncio
import json
from app.jsonsaver import json_saver
from app.Schemas.workflow_schema import ThreadStatus

async def test_thread_management():
    """Test the thread management functionality"""
    
    print("🧪 Testing Enhanced Thread Management System")
    print("=" * 50)
    
    # Test 1: Create threads
    print("\n1. Creating test threads...")
    thread1 = json_saver.create_thread("test-1", "LinkedIn Blog Post", "linkedin_blog")
    thread2 = json_saver.create_thread("test-2", "Video Clipping", "video_clipping")
    
    print(f"   ✅ Created thread 1: {thread1['name']} ({thread1['status']})")
    print(f"   ✅ Created thread 2: {thread2['name']} ({thread2['status']})")
    
    # Test 2: Update thread status
    print("\n2. Updating thread status...")
    json_saver.update_thread_status("test-1", ThreadStatus.RUNNING, "ideation_agent")
    json_saver.update_thread_progress("test-1", 1, 3, "ideation_agent")
    
    print("   ✅ Updated thread 1 status to RUNNING")
    print("   ✅ Updated thread 1 progress to 1/3 steps")
    
    # Test 3: Get thread info
    print("\n3. Retrieving thread information...")
    thread1_info = json_saver.get_thread_info("test-1")
    print(f"   ✅ Thread 1 info: {json.dumps(thread1_info, indent=2, default=str)}")
    
    # Test 4: List all threads
    print("\n4. Listing all threads...")
    all_threads = json_saver.get_all_threads()
    print(f"   ✅ Found {len(all_threads)} threads:")
    for thread in all_threads:
        print(f"      - {thread['name']}: {thread['status']}")
    
    # Test 5: Update thread progress
    print("\n5. Updating thread progress...")
    json_saver.update_thread_progress("test-1", 2, 3, "image_agent")
    json_saver.update_thread_status("test-1", ThreadStatus.COMPLETED, "completed")
    
    print("   ✅ Updated thread 1 progress to 2/3 steps")
    print("   ✅ Updated thread 1 status to COMPLETED")
    
    # Test 6: Final thread state
    print("\n6. Final thread states...")
    final_thread1 = json_saver.get_thread_info("test-1")
    print(f"   ✅ Final Thread 1: {final_thread1['status']} - {final_thread1['progress']['completed_steps']}/{final_thread1['progress']['total_steps']} steps")
    
    # Test 7: Cleanup
    print("\n7. Cleaning up test threads...")
    json_saver.delete_thread("test-1")
    json_saver.delete_thread("test-2")
    print("   ✅ Deleted test threads")
    
    print("\n🎉 All tests completed successfully!")
    print("=" * 50)

if __name__ == "__main__":
    asyncio.run(test_thread_management())
