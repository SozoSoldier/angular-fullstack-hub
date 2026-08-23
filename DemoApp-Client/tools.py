import os
import subprocess
from langchain_core.tools import tool

@tool
def read_file(file_path: str) -> str:
    """Reads the contents of an existing workspace file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

@tool
def write_file(file_path: str, content: str) -> str:
    """Writes or overwrites code into a specific workspace file path."""
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return f"Successfully written to {file_path}"
    except Exception as e:
        return f"Error writing file: {str(e)}"

@tool
def run_ng_command(command: str) -> str:
    """Executes local Angular CLI commands like 'ng generate component name' or 'ng build'."""
    # Safety check: restrict to Angular/npm commands
    if not (command.strip().startswith("ng ") or command.strip().startswith("npm ")):
        return "Error: Only 'ng' or 'npm' commands are allowed for workspace safety."
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        return result.stdout if result.stdout else "Command executed successfully with no output."
    except subprocess.CalledProcessError as e:
        return f"CLI Error: {e.stderr if e.stderr else e.stdout}"
