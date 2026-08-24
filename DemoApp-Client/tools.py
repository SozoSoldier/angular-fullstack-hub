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
        # UPGRADE: Added encoding='utf-8' to prevent Windows cp1252 decode crashes
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            encoding='utf-8', 
            check=True
        )
        return result.stdout if result.stdout else "Command executed successfully with no output."
    except subprocess.CalledProcessError as e:
        # UPGRADE: Ensure error streams are also captured cleanly in UTF-8
        return f"CLI Error: {e.stderr if e.stderr else e.stdout}"

        
@tool
def create_git_branch(branch_name: str) -> str:
    """Creates and switches to a new Git branch for the agent's work. 
    Accepts an alphanumeric string using dashes (e.g., 'feat-user-profile')."""
    # Clean the branch name slightly to prevent syntax breaks
    clean_name = branch_name.strip().replace(" ", "-").lower()
    try:
        # Check if we are in a git repository
        subprocess.run("git status", shell=True, capture_output=True, check=True)
        # Create and checkout the branch
        result = subprocess.run(f"git checkout -b {clean_name}", shell=True, capture_output=True, text=True, check=True)
        return f"Successfully created and switched to branch: {clean_name}"
    except subprocess.CalledProcessError as e:
        return f"Git Error: Ensure you are in a initialized Git repo. Details: {e.stderr}"

@tool
def commit_all_changes(commit_message: str) -> str:
    """Stages all workspace changes and commits them to the current Git branch."""
    try:
        # Stage everything
        subprocess.run("git add .", shell=True, capture_output=True, check=True)
        # Commit
        result = subprocess.run(f'git commit -m "{commit_message}"', shell=True, capture_output=True, text=True, check=True)
        return f"Successfully committed changes with message: '{commit_message}'"
    except subprocess.CalledProcessError as e:
        return f"Git Commit Error: {e.stderr if e.stderr else 'No changes to commit or git not configured.'}"
        
@tool
def modify_file_text(file_path: str, search_string: str, replace_string: str) -> str:
    """Safely updates specific blocks of code inside a file by swapping a target search string with a new replacement string."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            file_content = f.read()
        
        if search_string not in file_content:
            return f"Modification Error: Could not find the exact text block '{search_string}' inside {file_path}."
        
        # Perform clean string swap
        updated_content = file_content.replace(search_string, replace_string)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
            
        return f"Successfully updated text block in {file_path}."
    except Exception as e:
        return f"Error modifying file: {str(e)}"


