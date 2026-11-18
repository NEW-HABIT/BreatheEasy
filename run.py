"""
BreatheEasy — Single Command Unified Launcher
Launches both the Python FastAPI backend (Port 8000) and the Next.js frontend (Port 3000) simultaneously.

Usage:
  python run.py
  OR
  npm run dev:all
"""

import os
import sys
import time
import subprocess
import webbrowser
import signal

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

def main():
    print("=" * 65)
    print("🌿 BreatheEasy — GenAI Urban Air Quality Assistant")
    print("=" * 65)
    print("Starting Unified Services...")
    print("• Backend:  FastAPI + SQLAlchemy (http://localhost:8000)")
    print("• Frontend: Next.js + Apple Glass UI (http://localhost:3000)")
    print("=" * 65)

    # 1. Start Python FastAPI backend process
    print("\n[1/2] 🚀 Launching FastAPI backend...")
    backend_cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "main:app",
        "--app-dir",
        "backend",
        "--host",
        "0.0.0.0",
        "--port",
        "8000",
        "--reload"
    ]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=ROOT_DIR,
        shell=False
    )

    # Brief delay for backend socket binding
    time.sleep(2)

    # 2. Start Next.js frontend process
    print("[2/2] 🚀 Launching Next.js frontend...")
    # On Windows, npm is npm.cmd
    npm_cmd = "npm.cmd" if sys.platform.startswith("win") else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=ROOT_DIR,
        shell=True if sys.platform.startswith("win") else False
    )

    time.sleep(3)
    print("\n" + "=" * 65)
    print("✨ Both services are active!")
    print("👉 Frontend: http://localhost:3000")
    print("👉 Backend API Docs: http://localhost:8000/docs")
    print("Press Ctrl+C to gracefully stop all services.")
    print("=" * 65 + "\n")

    # Open browser automatically
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    try:
        # Keep launcher alive and monitor processes
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("Backend process exited.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend process exited.")
                break
    except KeyboardInterrupt:
        print("\nStopping BreatheEasy services...")
    finally:
        # Gracefully terminate child processes
        try:
            if backend_proc.poll() is None:
                backend_proc.terminate()
        except Exception:
            pass

        try:
            if frontend_proc.poll() is None:
                if sys.platform.startswith("win"):
                    subprocess.call(["taskkill", "/F", "/T", "/PID", str(frontend_proc.pid)])
                else:
                    frontend_proc.terminate()
        except Exception:
            pass

        print("All services stopped cleanly. Goodbye!")

if __name__ == "__main__":
    main()
