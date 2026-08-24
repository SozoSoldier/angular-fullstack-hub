import os
import json
import re
from langchain.agents import create_agent
from tools import read_file, write_file, run_ng_command, create_git_branch, commit_all_changes, modify_file_text

def initialize_universal_llm():
    """Detects which API keys are set in your terminal environment and returns the appropriate LLM."""
    # 1. Check for Anthropic Claude (Excellent for high-quality coding)
    if os.environ.get("ANTHROPIC_API_KEY"):
        from langchain_anthropic import ChatAnthropic
        print("🔌 Universal Adapter: Connected to Anthropic Claude Engine.")
        return ChatAnthropic(model="claude-3-5-sonnet-latest", temperature=0)
    
    # 2. Check for OpenAI ChatGPT (Industry standard reasoning)
    elif os.environ.get("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        print("🔌 Universal Adapter: Connected to OpenAI ChatGPT Engine.")
        return ChatOpenAI(model="gpt-4o-mini", temperature=0)
        
    # 3. Check for Groq (Blazing fast open-source Llama hosting - great free tier)
    elif os.environ.get("GROQ_API_KEY"):
        from langchain_openai import ChatOpenAI
        print("🔌 Universal Adapter: Connected to Groq Developer Cloud Engine.")
        return ChatOpenAI(
            base_url="https://groq.com",
            api_key=os.environ.get("GROQ_API_KEY"),
            model="llama-3.3-70b-versatile",  # <--- UPDATE THIS MODEL STRING HERE
            temperature=0
        )
        
    # 4. Fallback to our existing Google Gemini setup
    elif os.environ.get("GEMINI_API_KEY"):
        from langchain_google_genai import ChatGoogleGenerativeAI
        print("🔌 Universal Adapter: Connected to Google Gemini Engine.")
        return ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0)
        
    else:
        raise ValueError("❌ Error: No valid cloud API key found! Please set ANTHROPIC_API_KEY, OPENAI_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY.")

if __name__ == "__main__":
    try:
        # Dynamically load the engine based on your active keys
        llm = initialize_universal_llm()
    except Exception as e:
        print(str(e))
        exit(1)

    use_git_input = input("🤖 Enable automated Git branch & commits? (y/n): ").strip().lower()
    use_git = use_git_input in ['y', 'yes', '']
    
    user_input = input("\n[UNIVERSAL ENGINE] What Angular feature would you like to build? ")
    
    # Configure toolsets dynamically
    if use_git:
        tools = [read_file, write_file, run_ng_command, create_git_branch, commit_all_changes, modify_file_text]
        git_instructions = """
        1. Immediately create a new git branch based on the feature request using `create_git_branch`.
        2. Modify code files or create new ones using your tools.
        3. Run verification with `run_ng_command`.
        4. Once complete and verified, you MUST save your work using `commit_all_changes`."""
    else:
        tools = [read_file, write_file, run_ng_command, modify_file_text]
        git_instructions = """
        1. Modify or create files directly in the current workspace branch using your file tools. Do NOT look for git tools.
        2. Run verification with `run_ng_command`.
        3. Once complete and verified, declare success directly to the user."""

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
    
    print("\n🔍 Automatically scanning workspace files to gather background context...")
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

    print("\n🤖 Running universal agent loop...")
    
    try:
        response = agent.invoke({"messages": enriched_prompt})
        print("=" * 60)
        print("🚀 ANGULAR UNIVERSAL AGENT EXECUTION COMPLETE")
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
        print(f"\n❌ Universal Execution Error: {str(e)}")
