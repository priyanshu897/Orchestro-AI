#!/usr/bin/env python3
"""
Demo script for the enhanced workflow thread management system.
This script creates sample threads and shows their management capabilities.
"""

import asyncio
import json
import time
from app.jsonsaver import json_saver
from app.Schemas.workflow_schema import ThreadStatus

async def demo_workflow_threads():
    """Demonstrate workflow thread management capabilities"""
    
    print("🚀 Workflow Thread Management Demo")
    print("=" * 50)
    
    # Create sample threads
    print("\n1. Creating sample workflow threads...")
    
    thread1 = json_saver.create_thread(
        "demo-linkedin-1", 
        "Create LinkedIn post about AI trends", 
        "linkedin_blog"
    )
    
    thread2 = json_saver.create_thread(
        "demo-video-1", 
        "Generate video clips for marketing", 
        "video_clipping"
    )
    
    thread3 = json_saver.create_thread(
        "demo-social-1", 
        "Create social media campaign", 
        "linkedin_blog"
    )
    
    print(f"   ✅ Created {thread1['name']} (ID: {thread1['thread_id']})")
    print(f"   ✅ Created {thread2['name']} (ID: {thread2['thread_id']})")
    print(f"   ✅ Created {thread3['name']} (ID: {thread3['thread_id']})")
    
    # Simulate workflow execution
    print("\n2. Simulating workflow execution...")
    
    # Thread 1: LinkedIn workflow
    print(f"\n   📝 Executing {thread1['name']}...")
    json_saver.update_thread_status("demo-linkedin-1", ThreadStatus.RUNNING, "ideation_agent")
    json_saver.update_thread_progress("demo-linkedin-1", 1, 3, "ideation_agent")
    time.sleep(1)
    
    json_saver.update_thread_progress("demo-linkedin-1", 2, 3, "image_agent")
    time.sleep(1)
    
    json_saver.update_thread_progress("demo-linkedin-1", 3, 3, "linkedin_agent")
    json_saver.update_thread_status("demo-linkedin-1", ThreadStatus.COMPLETED, "completed")
    print("   ✅ LinkedIn workflow completed!")
    
    # Thread 2: Video workflow (paused)
    print(f"\n   🎬 Executing {thread2['name']}...")
    json_saver.update_thread_status("demo-video-1", ThreadStatus.RUNNING, "video_clipping_agent")
    json_saver.update_thread_progress("demo-video-1", 1, 2, "video_clipping_agent")
    time.sleep(1)
    
    json_saver.update_thread_status("demo-video-1", ThreadStatus.PAUSED, "paused")
    print("   ⏸️ Video workflow paused")
    
    # Thread 3: Social workflow (running)
    print(f"\n   📱 Executing {thread3['name']}...")
    json_saver.update_thread_status("demo-social-1", ThreadStatus.RUNNING, "ideation_agent")
    json_saver.update_thread_progress("demo-social-1", 1, 3, "ideation_agent")
    print("   🔄 Social workflow running...")
    
    # Show final states
    print("\n3. Final thread states:")
    print("-" * 30)
    
    all_threads = json_saver.get_all_threads()
    for thread in all_threads:
        status_emoji = {
            'pending': '⏳',
            'running': '🔄',
            'completed': '✅',
            'failed': '❌',
            'paused': '⏸️'
        }.get(thread['status'], '❓')
        
        progress = thread['progress']
        progress_text = f"{progress['completed_steps']}/{progress['total_steps']}" if progress['total_steps'] > 0 else "0/0"
        
        print(f"   {status_emoji} {thread['name']}")
        print(f"      Status: {thread['status']}")
        print(f"      Progress: {progress_text} steps")
        print(f"      Current: {progress['current_step']}")
        print(f"      Type: {thread['workflow_type']}")
        print()
    
    print("4. API Endpoints available:")
    print("   GET /api/threads - List all threads")
    print("   GET /api/threads/{id} - Get thread details")
    print("   DELETE /api/threads/{id} - Delete thread")
    print("   POST /api/threads/{id}/pause - Pause thread")
    print("   POST /api/threads/{id}/resume - Resume thread")
    
    print("\n🎉 Demo completed! Threads are now available for testing.")
    print("   You can start the backend server and test the frontend.")
    print("   Use the API endpoints above to manage these threads.")

if __name__ == "__main__":
    asyncio.run(demo_workflow_threads())
