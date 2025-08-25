import asyncio
from typing import AsyncGenerator, Dict, Any
from app.jsonsaver import json_saver
from app.Schemas.workflow_schema import ThreadStatus, ThreadProgress
import time

class WorkflowService:
    def __init__(self):
        self.workflows = {
            'linkedin_blog': {
                'name': 'LinkedIn Blog Creation',
                'steps': ['ideation_agent', 'image_agent', 'linkedin_agent'],
                'total_steps': 3
            },
            'video_clipping': {
                'name': 'Video Clipping',
                'steps': ['video_clipping_agent', 'video_posting_agent'],
                'total_steps': 2
            },
            'social_media': {
                'name': 'Social Media Campaign',
                'steps': ['ideation_agent', 'image_agent', 'posting_agent'],
                'total_steps': 3
            }
        }

    def detect_workflow_type(self, prompt: str) -> str:
        """Detect workflow type based on prompt content"""
        prompt_lower = prompt.lower()
        
        if any(word in prompt_lower for word in ['linkedin', 'post', 'blog', 'article']):
            return 'linkedin_blog'
        elif any(word in prompt_lower for word in ['video', 'clip', 'youtube', 'instagram', 'tiktok']):
            return 'video_clipping'
        elif any(word in prompt_lower for word in ['social', 'campaign', 'marketing', 'content']):
            return 'social_media'
        else:
            return 'linkedin_blog'  # default

    async def orchestrate_workflow(self, prompt: str, thread_id: str) -> AsyncGenerator[Dict[str, Any], None]:
        """Orchestrate workflow execution with real-time updates"""
        try:
            # Detect workflow type
            workflow_type = self.detect_workflow_type(prompt)
            workflow_config = self.workflows[workflow_type]
            
            # Update thread with workflow type
            json_saver.update_thread_status(thread_id, ThreadStatus.RUNNING, 'starting')
            
            # Initialize progress
            completed_steps = 0
            total_steps = workflow_config['total_steps']
            
            # Send workflow start event
            yield {
                "type": "workflow_start",
                "workflow_type": workflow_type,
                "total_steps": total_steps,
                "thread_id": thread_id,
                "timestamp": time.time()
            }
            
            # Execute each step
            for step_index, step_name in enumerate(workflow_config['steps'], 1):
                # Update progress
                completed_steps = step_index - 1
                current_step = step_name
                
                # Send progress update
                yield {
                    "type": "progress",
                    "progress": {
                        "completed": completed_steps,
                        "total": total_steps,
                        "current_step": current_step,
                        "percentage": round((completed_steps / total_steps) * 100, 1)
                    },
                    "thread_id": thread_id,
                    "timestamp": time.time()
                }
                
                # Update thread progress
                json_saver.update_thread_progress(thread_id, completed_steps, total_steps, current_step)
                
                # Send step start event
                yield {
                    "type": "step_start",
                    "node": step_name,
                    "step_number": step_index,
                    "step_name": step_name.replace('_', ' ').title(),
                    "thread_id": thread_id,
                    "timestamp": time.time()
                }
                
                # Simulate agent work (replace with actual agent calls)
                await self.simulate_agent_work(step_name)
                
                # Send step completion event
                yield {
                    "type": "step_complete",
                    "node": step_name,
                    "output": f"Completed {step_name.replace('_', ' ').title()} successfully",
                    "step_number": step_index,
                    "thread_id": thread_id,
                    "timestamp": time.time()
                }
                
                # Update progress
                completed_steps = step_index
                json_saver.update_thread_progress(thread_id, completed_steps, total_steps, current_step)
                
                # Small delay between steps
                await asyncio.sleep(0.5)
            
            # Send workflow completion event
            yield {
                "type": "workflow_complete",
                "node": "__end__",
                "output": f"Workflow '{workflow_config['name']}' completed successfully!",
                "progress": {
                    "completed": total_steps,
                    "total": total_steps,
                    "current_step": "completed",
                    "percentage": 100
                },
                "thread_id": thread_id,
                "timestamp": time.time()
            }
            
            # Update final status
            json_saver.update_thread_status(thread_id, ThreadStatus.COMPLETED, 'completed')
            
        except Exception as e:
            # Send error event
            yield {
                "type": "error",
                "message": str(e),
                "thread_id": thread_id,
                "timestamp": time.time()
            }
            
            # Update thread status to failed
            json_saver.update_thread_status(thread_id, ThreadStatus.FAILED, 'error')
            raise

    async def simulate_agent_work(self, agent_name: str):
        """Simulate agent work (replace with actual agent implementations)"""
        # Simulate different types of work based on agent
        if 'ideation' in agent_name:
            await asyncio.sleep(2)  # Simulate thinking time
        elif 'image' in agent_name:
            await asyncio.sleep(3)  # Simulate image generation
        elif 'video' in agent_name:
            await asyncio.sleep(4)  # Simulate video processing
        elif 'posting' in agent_name or 'linkedin' in agent_name:
            await asyncio.sleep(1)  # Simulate posting
        else:
            await asyncio.sleep(1)  # Default

    def get_workflow_app(self, workflow_type: str = None):
        """Get workflow configuration"""
        if workflow_type and workflow_type in self.workflows:
            return self.workflows[workflow_type]
        return self.workflows