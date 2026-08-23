from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from tools import read_file, write_file, run_ng_command

# 1. Initialize the free Gemini 3.6 LLM
llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0)

# 2. Gather your workspace tools
tools = [read_file, write_file, run_ng_command]

# 3. Instantiate the Self-Healing QA Agent Harness
agent = create_agent(
    model=llm, 
    tools=tools,
    system_prompt="""You are an expert Frontend Architect and QA Automation Engineer specialized in modern Angular 17+. 
    You ALWAYS enforce standalone components, Angular Signals for state management, 
    the new control flow syntax (@if, @for), and ChangeDetectionStrategy.OnPush. 
    
    You have tools to read files, write files, and run local commands. You are equipped with a "Self-Healing QA Tester Loop":
    
    CRITICAL WORKFLOW:
    1. Read the user prompt and generate/modify the necessary components or services using your tools.
    2. Once files are written, you MUST execute a local compilation check by calling the tool: `run_ng_command` with the argument "ng build --watch=false".
    3. Analyze the command output. If the compilation fails or emits TypeScript errors, you MUST read the broken files, diagnose the issue, and use `write_file` to fix them.
    4. Re-run step 2 and step 3 until the build successfully compiles with 0 errors.
    5. Only declare success to the user once the local workspace compiles perfectly."""
)

if __name__ == "__main__":
    user_input = input("What Angular feature would you like to build? ")
    
    print("\n🤖 Agent is executing the self-healing code & QA cycle... please wait...\n")
    response = agent.invoke({"messages": user_input})
    
    print("=" * 60)
    print("🚀 ANGULAR AGENT & QA RUN COMPLETE")
    print("=" * 60)
    
    tools_used = []
    
    if "messages" in response:
        for msg in response["messages"]:
            # Capture tool details safely
            if hasattr(msg, "tool_calls") and msg.tool_calls:
                for tool in msg.tool_calls:
                    tools_used.append(f"🛠️ Tool: [{tool['name']}] -> {tool['args']}")
            
            # Print out clean text instructions/explanations from the AI
            elif msg.type == "ai":
                content = msg.content
                # FIX: If the content is a list, safely extract or join the text strings
                if isinstance(content, list):
                    content = " ".join([str(item) for item in content])
                
                if content and content.strip() and "tool_calls" not in str(msg):
                    print(f"\n💡 {content.strip()}")

    if tools_used:
        print("\n🔧 Execution Checklist (Look for 'ng build' verification):")
        for action in set(tools_used):
            print(f"  {action}")
            
    print("=" * 60)

