import os
import json
import tkinter as tk
from tkinter import ttk

BG_COLOR = "#1a1a2e"
FG_COLOR = "#ffffff"
ACCENT_COLOR = "#3b82f6"
TEXT_COLOR = "#e2e8f0"

class EFADashboard(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("EFA Dashboard")
        self.geometry("1000x700")
        self.configure(bg=BG_COLOR)

        style = ttk.Style()
        style.theme_use('clam')
        style.configure('TNotebook', background=BG_COLOR, borderwidth=0)
        style.configure('TNotebook.Tab', background=BG_COLOR, foreground=TEXT_COLOR, padding=[10, 5], borderwidth=0)
        style.map('TNotebook.Tab', background=[('selected', ACCENT_COLOR)], foreground=[('selected', FG_COLOR)])
        style.configure('TFrame', background=BG_COLOR)
        style.configure('TLabel', background=BG_COLOR, foreground=TEXT_COLOR)

        self.notebook = ttk.Notebook(self)
        self.notebook.pack(expand=True, fill='both', padx=10, pady=10)

        # Tabs
        self.tabs = {}
        for tab_name in ["Agents", "Skills", "Commands", "Hooks", "Memory"]:
            frame = ttk.Frame(self.notebook)
            self.tabs[tab_name] = frame

        self.load_data()

        # Add tabs to notebook
        self.notebook.add(self.tabs["Agents"], text=f"Agents ({len(self.data['Agents'])})")
        self.notebook.add(self.tabs["Skills"], text=f"Skills ({len(self.data['Skills'])})")
        self.notebook.add(self.tabs["Commands"], text=f"Commands ({len(self.data['Commands'])})")
        self.notebook.add(self.tabs["Hooks"], text=f"Hooks ({len(self.data['Hooks'])})")
        self.notebook.add(self.tabs["Memory"], text=f"Memory ({len(self.data['Memory'])})")

        self.build_tab("Agents", self.data["Agents"], ["Name", "Description"])
        self.build_tab("Skills", self.data["Skills"], ["Name", "Description"])
        self.build_tab("Commands", self.data["Commands"], ["Command", "Description"])
        self.build_tab("Hooks", self.data["Hooks"], ["Event", "Matcher", "Command"])
        self.build_tab("Memory", self.data["Memory"], ["Tags", "Memory"])

        # Status Bar
        version = self.read_file("VERSION", "Unknown")
        status_bar = tk.Label(self, text=f"EFA Version: {version}", bd=1, relief=tk.SUNKEN, anchor=tk.W, bg=BG_COLOR, fg=TEXT_COLOR)
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)

    def read_file(self, path, default=""):
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return f.read().strip()
        return default

    def parse_md_frontmatter(self, path):
        content = self.read_file(path)
        lines = content.split('\n')
        metadata = {}
        in_frontmatter = False
        for line in lines:
            if line.strip() == '---':
                if not in_frontmatter:
                    in_frontmatter = True
                    continue
                else:
                    break
            if in_frontmatter and ':' in line:
                k, v = line.split(':', 1)
                metadata[k.strip()] = v.strip().strip('"\'')
        return metadata

    def load_data(self):
        self.data = { "Agents": [], "Skills": [], "Commands": [], "Hooks": [], "Memory": [] }
        
        # Agents
        if os.path.exists("agents"):
            for f in sorted(os.listdir("agents")):
                if f.endswith(".md"):
                    meta = self.parse_md_frontmatter(os.path.join("agents", f))
                    self.data["Agents"].append({"Name": meta.get("name", f), "Description": meta.get("description", "")})

        # Skills
        if os.path.exists("skills"):
            for d in sorted(os.listdir("skills")):
                skill_file = os.path.join("skills", d, "SKILL.md")
                if os.path.exists(skill_file):
                    meta = self.parse_md_frontmatter(skill_file)
                    self.data["Skills"].append({"Name": d, "Description": meta.get("description", "")})

        # Commands
        if os.path.exists("commands"):
            for f in sorted(os.listdir("commands")):
                if f.endswith(".md"):
                    meta = self.parse_md_frontmatter(os.path.join("commands", f))
                    self.data["Commands"].append({"Command": "/" + f.replace('.md', ''), "Description": meta.get("description", "")})

        # Hooks
        hooks_path = os.path.join("hooks", "hooks.json")
        if os.path.exists(hooks_path):
            try:
                with open(hooks_path, 'r') as f:
                    hooks_data = json.load(f).get("hooks", {})
                    for event, hook_list in hooks_data.items():
                        for h in hook_list:
                            self.data["Hooks"].append({"Event": event, "Matcher": h.get("matcher", ""), "Command": h.get("command", "")})
            except Exception:
                pass

        # Memory
        mem_path = ".efa-vector-memory.json"
        if os.path.exists(mem_path):
            try:
                with open(mem_path, 'r') as f:
                    mem_data = json.load(f).get("memories", [])
                    for m in mem_data:
                        self.data["Memory"].append({"Tags": ", ".join(m.get("tags", [])), "Memory": m.get("content", "")})
            except Exception:
                pass

    def build_tab(self, tab_name, items, columns):
        frame = self.tabs[tab_name]
        
        top_frame = tk.Frame(frame, bg=BG_COLOR)
        top_frame.pack(fill=tk.X, padx=10, pady=5)
        
        tk.Label(top_frame, text="Search:", bg=BG_COLOR, fg=TEXT_COLOR).pack(side=tk.LEFT)
        search_var = tk.StringVar()
        search_entry = tk.Entry(top_frame, textvariable=search_var, bg="#2d3748", fg=TEXT_COLOR, insertbackground=TEXT_COLOR)
        search_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)

        tree_frame = tk.Frame(frame, bg=BG_COLOR)
        tree_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        tree = ttk.Treeview(tree_frame, columns=columns, show='headings')
        for col in columns:
            tree.heading(col, text=col)
            tree.column(col, width=200 if col != columns[-1] else 600)
            
        scrollbar = ttk.Scrollbar(tree_frame, orient=tk.VERTICAL, command=tree.yview)
        tree.configure(yscroll=scrollbar.set)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        def update_list(*args):
            query = search_var.get().lower()
            tree.delete(*tree.get_children())
            for item in items:
                values = [item.get(c, "") for c in columns]
                if not query or any(query in str(v).lower() for v in values):
                    tree.insert("", tk.END, values=values)
                    
        search_var.trace("w", update_list)
        update_list()

if __name__ == "__main__":
    app = EFADashboard()
    app.mainloop()
