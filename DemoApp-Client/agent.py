import os
import json
import re
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from tools import read_file, write_file, run_ng_command, create_git_branch, commit_all_changes, modify_file_text

# 1. Initialize the ultra-fast, cloud-powered Gemini 3.6 engine
llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0)

# 2. Wire up your robust suite of native local workspace tools
tools = [read_file, write_file, run_ng_command, create_git_branch, commit_all_changes, modify_file_text]

# 3. Create the Principal Agent with advanced reasoning rules
agent = create_agent(
    model=llm, 
    tools=tools,
    system_prompt="""You are an expert Cloud Frontend Architect and QA Automation Engineer specialized in modern Angular 17+. 
    You ALWAYS enforce standalone components, Angular Signals, the new control flow layout (@if, @for), and OnPush change detection.
    
    You have full access to native local tools. Follow this strict execution loop sequence:
    1. Immediately create a new git branch based on the feature request using `create_git_branch`.
    2. Analyze any automatically injected file code provided in the prompt context.
    3. Modify existing files surgically using `modify_file_text` to prevent duplicate variable errors. Only use `write_file` for brand new files.
    4. You must enforce Tailwind CSS utility classes exclusively for any UI styling inside your templates.
    5. Run a local compilation verification by executing `run_ng_command` with "ng build --watch=false".
    6. Self-Heal: If the build fails, read the log, fix the code files immediately, and compile again.
    7. Once the compilation successfully passes with 0 errors, you MUST save your work using `commit_all_changes`.
    8. Summarize your execution details cleanly to the user once complete."""
)

if __name__ == "__main__":
    user_input = input("[CLOUD ENGINE] What Angular feature would you like to build? ")
    
    print("\n🔍 Automatically scanning workspace files to gather background context for Gemini...")
    
    # Universal Scanner: Grabs real file layouts based on keywords in your short prompt
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

    # Pack user input and background code context together
    if found_files_context:
        enriched_prompt = f"User Request: {user_input}\n\nWorkspace File Context:\n{found_files_context}"
    else:
        enriched_prompt = user_input

    print("\n🤖 Cloud Agent is executing the Git + QA lifecycle via Gemini API...")
    
    try:
        response = agent.invoke({"messages": enriched_prompt})
        
        print("=" * 60)
        print("🚀 ANGULAR CLOUD AGENT EXECUTION COMPLETE")
        print("=" * 60)
        
        # Clean terminal output formatting
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
