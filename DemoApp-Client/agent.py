import os
import json
import re
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from tools import read_file, write_file, run_ng_command, create_git_branch, commit_all_changes, modify_file_text

# 1. Initialize the cloud engine
llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0)

if __name__ == "__main__":
    # Ask the user for their preferences first to save token quota
    use_git_input = input("🤖 Enable automated Git branch & commits? (y/n): ").strip().lower()
    use_git = use_git_input in ['y', 'yes', '']
    
    user_input = input("\n[CLOUD ENGINE] What Angular feature would you like to build? ")
    
    # 2. Dynamically adjust tools based on user preference
    if use_git:
        tools = [read_file, write_file, run_ng_command, create_git_branch, commit_all_changes, modify_file_text]
        git_instructions = """
        1. Immediately create a new git branch based on the feature request using `create_git_branch`.
        2. Modify code files or create new ones using your tools.
        3. Run verification with `run_ng_command`.
        4. Once complete and verified, you MUST save your work using `commit_all_changes`."""
    else:
        # Bypassing git tools saves 2-3 API calls per execution!
        tools = [read_file, write_file, run_ng_command, modify_file_text]
        git_instructions = """
        1. Modify or create files directly in the current workspace branch using your file tools. Do NOT look for git tools.
        2. Run verification with `run_ng_command`.
        3. Once complete and verified, declare success directly to the user."""

    # 3. Instantiate the agent with the tailored prompt instructions
    agent = create_agent(
        model=llm, 
        tools=tools,
        system_prompt=f"""You are an expert Cloud Frontend Architect and QA Automation Engineer specialized in modern Angular 17+. 
        You ALWAYS enforce standalone components, Angular Signals, the new control flow layout (@if, @for), and OnPush change detection.
        You must enforce Tailwind CSS utility classes exclusively for any UI styling inside your templates.
        
        You have access to native local tools. Follow this strict execution loop sequence:
        {git_instructions}
        5. Self-Heal: If the build fails, read the log, fix the code files immediately, and compile again.
        6. Summarize your execution details cleanly to the user once complete."""
    )
    
    print("\n🔍 Automatically scanning workspace files to gather background context for Gemini...")
    
    clean_prompt = user_input.lower().replace(".", " ").replace("/", " ")
    keywords = [word for word in clean_prompt.split() if len(word) > 3]
    
    found_files_context = ""
    scanned_count = 0
    
    for root, dirs, files in os.walk("src/app"):
        for file in files:
            if file.endswith(('.ts', '.html', '.scss')):
                file_path = os.path.join(root, file).replace("\\", "/")
                if any(keyword in file_path.lower() for keyword in keywords):
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            file_code = f.read()
                        found_files_context += f"\nFile Path: {file_path}\n```typescript\n{file_code}\n```\n"
                        scanned_count += 1
                        print(f"   ➕ Automatically injected layout for: {file_path}")
                    except Exception:
                        pass
                    if scanned_count >= 3:
                        break
        if scanned_count >= 3:
            break

    if found_files_context:
        enriched_prompt = f"User Request: {user_input}\n\nWorkspace File Context:\n{found_files_context}"
    else:
        enriched_prompt = user_input

    print("\n🤖 Cloud Agent is executing the Angular feature lifecycle via Gemini API...")
    
    try:
        response = agent.invoke({"messages": enriched_prompt})
        
        print("=" * 60)
        print("🚀 ANGULAR CLOUD AGENT EXECUTION COMPLETE")
        print("=" * 60)
        
        if "messages" in response:
            for msg in response["messages"]:
                if msg.type == "ai":
                    content = msg.content
                    if isinstance(content, list):
                        content = " ".join([str(item) for item in content])
                    if content and content.strip() and "tool_calls" not in str(msg):
                        print(f"\n💡 {content.strip()}")
        print("=" * 60)
        
    except Exception as e:
        if "RESOURCE_EXHAUSTED" in str(e):
            print("\n❌ Quota Ceiling Hit: You have used your 20 free cloud calls for the day.")
        else:
            print(f"\n❌ Execution Error: {str(e)}")
