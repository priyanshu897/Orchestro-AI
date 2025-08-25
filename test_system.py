#!/usr/bin/env python3
"""
Comprehensive system test for the workflow thread management system.
This script tests all components to ensure they're working correctly.
"""

import requests
import json
import time
from datetime import datetime

def test_backend_api():
    """Test the backend API endpoints"""
    print("🧪 Testing Backend API")
    print("=" * 40)
    
    base_url = "http://localhost:8000"
    
    try:
        # Test 1: Check if backend is running
        print("1. Checking backend status...")
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("   ✅ Backend is running")
        else:
            print(f"   ❌ Backend returned status {response.status_code}")
            return False
            
        # Test 2: Get all threads
        print("\n2. Testing GET /api/threads...")
        response = requests.get(f"{base_url}/api/threads")
        if response.status_code == 200:
            data = response.json()
            thread_count = len(data.get('threads', []))
            print(f"   ✅ Success! Found {thread_count} threads")
            
            # Display thread summary
            for thread in data.get('threads', []):
                status_emoji = {
                    'pending': '⏳',
                    'running': '🔄',
                    'completed': '✅',
                    'failed': '❌',
                    'paused': '⏸️'
                }.get(thread['status'], '❓')
                
                print(f"      {status_emoji} {thread['name']} ({thread['status']})")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            return False
            
        # Test 3: Get specific thread
        print("\n3. Testing GET /api/threads/demo-linkedin-1...")
        response = requests.get(f"{base_url}/api/threads/demo-linkedin-1")
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Success! Thread details retrieved")
            print(f"      Name: {data['thread_info']['name']}")
            print(f"      Status: {data['thread_info']['status']}")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            
        # Test 4: Test pause functionality
        print("\n4. Testing POST /api/threads/demo-social-1/pause...")
        response = requests.post(f"{base_url}/api/threads/demo-social-1/pause")
        if response.status_code == 200:
            print("   ✅ Success! Thread paused")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            
        # Test 5: Test resume functionality
        print("\n5. Testing POST /api/threads/demo-video-1/resume...")
        response = requests.post(f"{base_url}/api/threads/demo-video-1/resume")
        if response.status_code == 200:
            print("   ✅ Success! Thread resumed")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            
        return True
        
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to backend. Is it running on port 8000?")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_frontend_instructions():
    """Provide frontend testing instructions"""
    print("\n🎨 Frontend Testing Instructions")
    print("=" * 40)
    print("1. Open a new terminal and start the frontend:")
    print("   cd Frontend")
    print("   npm start")
    print()
    print("2. Open your browser to http://localhost:3000")
    print("3. Navigate to /workflows")
    print("4. Look for the red 🐛 button (debug panel)")
    print("5. Click the 'Refresh' button in the sidebar")
    print("6. Check browser console for debug logs")
    print()
    print("Expected behavior:")
    print("- 3 threads should appear in the sidebar")
    print("- Each thread should show status and progress")
    print("- Debug panel should show successful connection")

def main():
    """Main test function"""
    print("🚀 Workflow Thread Management System Test")
    print("=" * 50)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test backend
    backend_ok = test_backend_api()
    
    if backend_ok:
        print("\n✅ Backend is working correctly!")
        print("   The issue is likely in the frontend or connection.")
    else:
        print("\n❌ Backend has issues that need to be fixed first.")
        print("   Check the backend server and restart if needed.")
        return
    
    # Provide frontend instructions
    test_frontend_instructions()
    
    print("\n🔍 Troubleshooting Tips:")
    print("- Check browser console for errors (F12)")
    print("- Verify CORS settings in backend")
    print("- Ensure both services are running")
    print("- Use the debug panel (🐛) to see connection status")
    
    print("\n📚 Documentation:")
    print("- TROUBLESHOOTING.md - Detailed troubleshooting guide")
    print("- QUICK_START.md - Quick start instructions")
    print("- WORKFLOW_THREADS_README.md - Complete system documentation")

if __name__ == "__main__":
    main()
