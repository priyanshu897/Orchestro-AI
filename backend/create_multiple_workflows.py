#!/usr/bin/env python3
"""
Script to create multiple workflow threads for testing the dynamic UI.
This will create various workflow types with different statuses.
"""

import asyncio
import time
from app.jsonsaver import json_saver
from app.Schemas.workflow_schema import ThreadStatus

async def create_multiple_workflows():
    """Create multiple workflow threads for testing"""
    
    print("🚀 Creating Multiple Workflow Threads for Testing")
    print("=" * 60)
    
    # Workflow 1: LinkedIn Blog (Completed)
    print("\n1. Creating LinkedIn Blog workflow (Completed)...")
    thread1 = json_saver.create_thread(
        "workflow-1", 
        "Create a comprehensive LinkedIn post about AI trends in 2024", 
        "linkedin_blog"
    )
    json_saver.update_thread_status("workflow-1", ThreadStatus.COMPLETED, "completed")
    json_saver.update_thread_progress("workflow-1", 3, 3, "completed")
    print(f"   ✅ Created: {thread1['name']} (ID: {thread1['thread_id']}) - Status: Completed")
    
    # Workflow 2: Video Clipping (Running)
    print("\n2. Creating Video Clipping workflow (Running)...")
    thread2 = json_saver.create_thread(
        "workflow-2", 
        "Generate video clips for YouTube Shorts about machine learning", 
        "video_clipping"
    )
    json_saver.update_thread_status("workflow-2", ThreadStatus.RUNNING, "video_clipping_agent")
    json_saver.update_thread_progress("workflow-2", 1, 2, "video_clipping_agent")
    print(f"   ✅ Created: {thread2['name']} (ID: {thread2['thread_id']}) - Status: Running")
    
    # Workflow 3: Social Media Campaign (Paused)
    print("\n3. Creating Social Media Campaign workflow (Paused)...")
    thread3 = json_saver.create_thread(
        "workflow-3", 
        "Create social media campaign for tech startup launch", 
        "social_media"
    )
    json_saver.update_thread_status("workflow-3", ThreadStatus.PAUSED, "ideation_agent")
    json_saver.update_thread_progress("workflow-3", 1, 3, "ideation_agent")
    print(f"   ✅ Created: {thread3['name']} (ID: {thread3['thread_id']}) - Status: Paused")
    
    # Workflow 4: LinkedIn Blog (Pending)
    print("\n4. Creating LinkedIn Blog workflow (Pending)...")
    thread4 = json_saver.create_thread(
        "workflow-4", 
        "Write LinkedIn article about blockchain technology trends", 
        "linkedin_blog"
    )
    json_saver.update_thread_status("workflow-4", ThreadStatus.PENDING, "pending")
    json_saver.update_thread_progress("workflow-4", 0, 3, "pending")
    print(f"   ✅ Created: {thread4['name']} (ID: {thread4['thread_id']}) - Status: Pending")
    
    # Workflow 5: Video Clipping (Failed)
    print("\n5. Creating Video Clipping workflow (Failed)...")
    thread5 = json_saver.create_thread(
        "workflow-5", 
        "Create Instagram Reels about data science tutorials", 
        "video_clipping"
    )
    json_saver.update_thread_status("workflow-5", ThreadStatus.FAILED, "error")
    json_saver.update_thread_progress("workflow-5", 0, 2, "error")
    print(f"   ✅ Created: {thread5['name']} (ID: {thread5['thread_id']}) - Status: Failed")
    
    # Workflow 6: Social Media (Running)
    print("\n6. Creating Social Media workflow (Running)...")
    thread6 = json_saver.create_thread(
        "workflow-6", 
        "Design marketing campaign for AI product launch", 
        "social_media"
    )
    json_saver.update_thread_status("workflow-6", ThreadStatus.RUNNING, "image_agent")
    json_saver.update_thread_progress("workflow-6", 2, 3, "image_agent")
    print(f"   ✅ Created: {thread6['name']} (ID: {thread6['thread_id']}) - Status: Running")
    
    # Workflow 7: LinkedIn Blog (Running)
    print("\n7. Creating LinkedIn Blog workflow (Running)...")
    thread7 = json_saver.create_thread(
        "workflow-7", 
        "Create LinkedIn post about sustainable technology", 
        "linkedin_blog"
    )
    json_saver.update_thread_status("workflow-7", ThreadStatus.RUNNING, "linkedin_agent")
    json_saver.update_thread_progress("workflow-7", 2, 3, "linkedin_agent")
    print(f"   ✅ Created: {thread7['name']} (ID: {thread7['thread_id']}) - Status: Running")
    
    # Workflow 8: Video Clipping (Completed)
    print("\n8. Creating Video Clipping workflow (Completed)...")
    thread8 = json_saver.create_thread(
        "workflow-8", 
        "Generate TikTok videos about coding tips and tricks", 
        "video_clipping"
    )
    json_saver.update_thread_status("workflow-8", ThreadStatus.COMPLETED, "completed")
    json_saver.update_thread_progress("workflow-8", 2, 2, "completed")
    print(f"   ✅ Created: {thread8['name']} (ID: {thread8['thread_id']}) - Status: Completed")
    
    print("\n" + "=" * 60)
    print("🎉 Successfully created 8 workflow threads!")
    print("\n📊 Summary:")
    print("   • Completed: 2 workflows")
    print("   • Running: 3 workflows") 
    print("   • Paused: 1 workflow")
    print("   • Pending: 1 workflow")
    print("   • Failed: 1 workflow")
    
    print("\n🧪 Testing Instructions:")
    print("   1. Start the backend: uvicorn app.main:app --reload --port 8000")
    print("   2. Start the frontend: npm start (in Frontend folder)")
    print("   3. Navigate to /workflows in your browser")
    print("   4. You should see all 8 workflows with different statuses")
    print("   5. Click on any workflow to see the dynamic progress")
    print("   6. Try pause/resume/delete operations")
    
    print("\n🔍 Expected Behavior:")
    print("   • All workflows should be visible in the sidebar")
    print("   • Status colors should be different for each status")
    print("   • Progress bars should show current progress")
    print("   • Real-time updates should work when workflows are running")
    print("   • Clicking workflows should open the detailed view")

if __name__ == "__main__":
    asyncio.run(create_multiple_workflows())
