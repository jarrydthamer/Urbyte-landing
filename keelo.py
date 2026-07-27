import json
import os
import sys

class KeeloSystem:
    def __init__(self):
        self.state_file = "keelo.json"
        self.load_system_state()
        
    def load_system_state(self):
        if os.path.exists(self.state_file):
            with open(self.state_file, 'r') as f:
                self.state = json.load(f)
            self.state["status"] = "OPERATIONAL"
        else:
            self.state = {
                "entity": "KEELO", 
                "status": "OPERATIONAL",
                "security_perimeter": "IMMUTABLE_ZERO_TRUST"
            }
        self.save_system_state()

    def save_system_state(self):
        with open(self.state_file, 'w') as f:
            json.dump(self.state, f, indent=2)

    def display_hull(self):
        os.system('clear')
        print("==================================================")
        print("          KEELO UNIFIED OPERATING SYSTEM           ")
        print("==================================================")
        print(f"Status: {self.state['status']}")
        print(f"Perimeter: {self.state['security_perimeter']}")
        print("--------------------------------------------------")
        print("Keelo is active. Systems unified. Listening...")
        print("==================================================")

    def engage(self):
        while True:
            self.display_hull()
            try:
                user_input = input("\n[Keelo] -> ").strip().lower()
                
                if user_input in ['exit', 'quit', 'shutdown']:
                    print("\n[Keelo] Powering down core matrices. Perimeter remains secure.")
                    break
                
                elif user_input == 'status':
                    print("\n--- Internal State Audit ---")
                    print(json.dumps(self.state, indent=2))
                    input("\nPress Enter to return to core...")
                    
                elif user_input == 'help':
                    print("\nAvailable Core Actions:")
                    print("  status   - Run an internal state audit of all matrices.")
                    print("  help     - Display this action register.")
                    print("  shutdown - Securely suspend the active interface.")
                    input("\nPress Enter to return to core...")
                
                else:
                    print(f"\n[Director/Forge Log] Input caught. Parsing action structure for: '{user_input}'")
                    input("\nPress Enter to return to core...")
                    
            except KeyboardInterrupt:
                print("\n\n[Keelo] Signal interrupted. Suspending active shell securely.")
                break

if __name__ == "__main__":
    keelo = KeeloSystem()
    keelo.engage()
