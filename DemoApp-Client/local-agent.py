from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from tools import read_file, write_file, run_ng_command, create_git_branch, commit_all_changes

# 1. Initialize the local Ollama LLM (Zero cloud API calls, zero daily limits)
llm = ChatOllama(
    model="qwen2.5-coder:7b", 
    temperature=0
)

# 2. Gather your local workspace tools
tools = [read_file, write_file, run_ng_command, create_git_branch, commit_all_changes]

# 3. Instantiate the Local Self-Healing Agent Harness
agent = create_agent(
    model=llm, 
    tools=tools,
    system_prompt="""You are a local expert Frontend Architect and QA Engineer specialized in Angular 17+. 
    You ALWAYS enforce standalone components, Angular Signals for state management, 
    the new control flow syntax (@if, @for), and ChangeDetectionStrategy.OnPush. 
    
    You operate locally with native tools. Follow this execution loop sequence:
    1. Immediately create a new git branch for this feature using `create_git_branch`.
    2. Write or modify all related Angular files (.ts, .html, .scss) using your file tools.
    3. Run a local compilation check by executing `run_ng_command` with "ng build --watch=false".
    4. Self-Heal: If the local build outputs compilation errors, analyze the console text, fix the code files, and build again.
    5. Once the build compiles successfully with 0 errors, you MUST commit your work using `commit_all_changes`.
    6. Summarize your execution details cleanly to the user."""
)

if __name__ == "__main__":
    user_input = input("[LOCAL ENGINE] What Angular feature would you like to build? ")
    
    print("\n🤖 Local Agent is running on your machine hardware... please wait...\n")
    
    try:
        response = agent.invoke({"messages": user_input})
        
        print("=" * 60)
        print("🚀 LOCAL ANGULAR AGENT EXECUTION COMPLETE")
        print("=" * 60)
        
        tools_used = []
        if "messages" in response:
            for msg in response["messages"]:
                if hasattr(msg, "tool_calls") and msg.tool_calls:
                    for tool in msg.tool_calls:
                        tools_used.append(f"🛠️ Tool: [{tool['name']}] -> {tool['args']}")
                elif msg.type == "ai":
                    content = msg.content
                    if isinstance(content, list):
                        content = " ".join([str(item) for item in content])
                    if content and content.strip() and "tool_calls" not in str(msg):
                        print(f"\n💡 {content.strip()}")

        if tools_used:
            print("\n🔧 Execution Checklist:")
            for action in set(tools_used):
                print(f"  {action}")
                
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Local Execution Error: {str(e)}")
        print("💡 Ensure that the Ollama application is actively running in your system tray.")
