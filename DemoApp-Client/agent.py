import time
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from tools import read_file, write_file, run_ng_command, create_git_branch, commit_all_changes

# 1. Initialize Gemini with automatic request spacing to protect your free tier quota
# This spaces out calls so the API doesn't flag rapid sequential tool execution as abuse.
llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash", 
    temperature=0
)

# 2. Gather workspace tools
tools = [read_file, write_file, run_ng_command, create_git_branch, commit_all_changes]

# 3. Optimize System Prompt to reduce total required API calls
agent = create_agent(
    model=llm, 
    tools=tools,
    system_prompt="""You are an expert Frontend Architect and QA Engineer specialized in Angular 17+. 
    You ALWAYS use standalone components, Angular Signals, and ChangeDetectionStrategy.OnPush.
    
    CRITICAL RESOURCE CONSTRAINT: You must be extremely efficient and minimize the number of API calls you make.
    
    STRICT SEQUENCE:
    1. Immediately create a new git branch for this task using `create_git_branch`.
    2. Write or modify the requested Angular files. To save your token quota, write all related files (.ts, .html, .scss) sequentially before calling the compiler.
    3. Run a local compilation check by executing `run_ng_command` with the argument "ng build --watch=false".
    4. Self-Heal: If the build fails, read the log, fix the code files in a single pass, and build again. Do not make tiny back-and-forth edits.
    5. Once the build compiles successfully with 0 errors, you MUST commit all of your work using `commit_all_changes`.
    6. Summarize your final success state to the user, including the branch name used."""
)

if __name__ == "__main__":
    user_input = input("What Angular feature would you like to build? ")
    
    print("\n🤖 Agent starting Git + QA Lifecycle... please wait...\n")
    
    # Introduce a short manual pause before execution to ensure any previous rate-limit windows clear
    time.sleep(2)
    
    try:
        response = agent.invoke({"messages": user_input})
        
        print("=" * 60)
        print("🚀 ANGULAR AGENT EXECUTION COMPLETE")
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
        if "RESOURCE_EXHAUSTED" in str(e):
            print("\n❌ Quota Limit Hit: You have exhausted your 20 free daily requests on this Google AI Studio project.")
            print("💡 To continue developing for free right now, you can either:")
            print("  1. Create a second Google AI Studio project/API key and swap the environment variable.")
            print("  2. Wait until your daily reset window clears.")
        else:
            raise e
