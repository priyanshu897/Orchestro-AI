#!/usr/bin/env python3
"""
Simple test script to verify the workflow service works correctly.
Run this from the backend directory: python test_workflow.py
"""

import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.Services.workflow_service import orchestrate_workflow

async def test_workflow():
    """Test the workflow service with a sample prompt."""
    
    # Test prompts
    test_prompts = [
        "Create a LinkedIn post about artificial intelligence",
        "Make video clips about machine learning for social media"
    ]
    
    for prompt in test_prompts:
        print(f"\n{'='*60}")
        print(f"Testing prompt: {prompt}")
        print(f"{'='*60}")
        
        try:
            async for event in orchestrate_workflow(prompt):
                print(f"Event: {event}")
                
                if event.get('type') == 'workflow_complete':
                    print("✅ Workflow completed successfully!")
                    break
                    
        except Exception as e:
            print(f"❌ Error testing workflow: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    print("🧪 Testing Orchestro AI Workflow Service")
    print("Make sure you have set your GOOGLE_API_KEY environment variable")
    
    try:
        asyncio.run(test_workflow())
    except KeyboardInterrupt:
        print("\n🛑 Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc() 