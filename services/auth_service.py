import base64
import hashlib
import hmac
import json
import os
import sqlite3
import time
from typing import Optional
from models import UserProfile

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "rezum.db")
SECRET_KEY = os.getenv("REZUM_SECRET_KEY", "rezum-super-secret-jwt-key-2025-career-intel").encode("utf-8")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password_hash TEXT,
                role_title TEXT DEFAULT 'Staff Software Engineer',
                location TEXT DEFAULT 'Austin, TX // Remote',
                avatar_url TEXT,
                provider TEXT DEFAULT 'local',
                google_sub TEXT,
                target_roles TEXT DEFAULT 'Staff Engineer, Principal Architect',
                salary_min TEXT DEFAULT '$220,000',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS saved_jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                job_id TEXT,
                job_title TEXT,
                company TEXT,
                status TEXT DEFAULT 'SAVED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS user_roadmaps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                pathway_id TEXT,
                completed_resources TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, pathway_id)
            )
        """)
        conn.commit()


# --- Password Hashing & Verification ---
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"{salt.hex()}:{key.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        parts = stored_hash.split(":")
        if len(parts) != 2:
            return False
        salt = bytes.fromhex(parts[0])
        expected_key = bytes.fromhex(parts[1])
        key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
        return hmac.compare_digest(key, expected_key)
    except Exception:
        return False


# --- Token Signing & Verification ---
def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _base64url_decode(s: str) -> bytes:
    padding = 4 - (len(s) % 4)
    if padding < 4:
        s += "=" * padding
    return base64.urlsafe_b64decode(s)


def create_token(user_id: int, email: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "uid": user_id,
        "email": email,
        "exp": int(time.time()) + 60 * 60 * 24 * 30  # 30 days
    }
    encoded_header = _base64url_encode(json.dumps(header).encode("utf-8"))
    encoded_payload = _base64url_encode(json.dumps(payload).encode("utf-8"))
    message = f"{encoded_header}.{encoded_payload}".encode("utf-8")
    signature = hmac.new(SECRET_KEY, message, hashlib.sha256).digest()
    encoded_sig = _base64url_encode(signature)
    return f"{encoded_header}.{encoded_payload}.{encoded_sig}"


def verify_token(token: str) -> Optional[dict]:
    try:
        parts = token.strip().split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        message = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(SECRET_KEY, message, hashlib.sha256).digest()
        actual_sig = _base64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        payload = json.loads(_base64url_decode(payload_b64).decode("utf-8"))
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None


# --- User CRUD Operations ---
def row_to_profile(row: sqlite3.Row) -> UserProfile:
    return UserProfile(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        role_title=row["role_title"] or "Software Engineer",
        location=row["location"] or "Remote",
        avatar_url=row["avatar_url"],
        provider=row["provider"] or "local",
        target_roles=row["target_roles"],
        salary_min=row["salary_min"]
    )


def register_user(name: str, email: str, password: str, role_title: str = "Staff Software Engineer") -> tuple[str, UserProfile]:
    email = email.strip().lower()
    name = name.strip()
    with get_db() as conn:
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            raise ValueError(f"An account with email {email} already exists. Please sign in.")
        
        pwd_hash = hash_password(password)
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO users (name, email, password_hash, role_title, provider)
               VALUES (?, ?, ?, ?, 'local')""",
            (name, email, pwd_hash, role_title)
        )
        user_id = cursor.lastrowid
        conn.commit()

        user_row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        profile = row_to_profile(user_row)
        token = create_token(user_id, email)
        return token, profile


def login_user(email: str, password: str) -> tuple[str, UserProfile]:
    email = email.strip().lower()
    with get_db() as conn:
        user_row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        if not user_row:
            # Auto-register new account seamlessly so login never locks out users
            pwd_hash = hash_password(password)
            clean_name = email.split("@")[0].replace(".", " ").replace("_", " ").replace("-", " ").title()
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO users (name, email, password_hash, role_title, provider)
                   VALUES (?, ?, ?, 'Staff Software Engineer', 'local')""",
                (clean_name, email, pwd_hash)
            )
            user_id = cursor.lastrowid
            conn.commit()
            created_row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            profile = row_to_profile(created_row)
            token = create_token(user_id, email)
            return token, profile
        
        stored_hash = user_row["password_hash"]
        if not stored_hash or not verify_password(password, stored_hash):
            raise ValueError("Invalid password. Please verify your credentials and try again.")
        
        profile = row_to_profile(user_row)
        token = create_token(user_row["id"], email)
        return token, profile


def google_login_or_register(credential: Optional[str] = None, email: Optional[str] = None,
                             name: Optional[str] = None, picture: Optional[str] = None,
                             sub: Optional[str] = None) -> tuple[str, UserProfile]:
    # If credential JWT from Google One-Tap/Identity is provided, decode payload
    if credential and credential.count(".") == 2:
        try:
            payload_part = credential.split(".")[1]
            payload_bytes = _base64url_decode(payload_part)
            g_payload = json.loads(payload_bytes.decode("utf-8"))
            email = g_payload.get("email") or email
            name = g_payload.get("name") or name
            picture = g_payload.get("picture") or picture
            sub = g_payload.get("sub") or sub
        except Exception:
            pass

    if not email:
        raise ValueError("Google identity could not be verified: email address missing.")
    
    email = email.strip().lower()
    name = name.strip() if name else email.split("@")[0].capitalize()

    with get_db() as conn:
        user_row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        if user_row:
            # Update avatar and google_sub if available
            conn.execute(
                """UPDATE users SET avatar_url = COALESCE(?, avatar_url),
                                    google_sub = COALESCE(?, google_sub)
                   WHERE id = ?""",
                (picture, sub, user_row["id"])
            )
            conn.commit()
            updated_row = conn.execute("SELECT * FROM users WHERE id = ?", (user_row["id"],)).fetchone()
            profile = row_to_profile(updated_row)
            token = create_token(user_row["id"], email)
            return token, profile
        else:
            # Create new user via Google
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO users (name, email, password_hash, role_title, avatar_url, provider, google_sub)
                   VALUES (?, ?, NULL, 'Staff Software Engineer', ?, 'google', ?)""",
                (name, email, picture, sub)
            )
            user_id = cursor.lastrowid
            conn.commit()
            new_row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            profile = row_to_profile(new_row)
            token = create_token(user_id, email)
            return token, profile


def get_user_by_id(user_id: int) -> Optional[UserProfile]:
    with get_db() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return row_to_profile(row) if row else None


def update_profile(user_id: int, updates: dict) -> UserProfile:
    allowed = ["name", "role_title", "location", "target_roles", "salary_min"]
    fields = []
    values = []
    for k in allowed:
        if k in updates and updates[k] is not None:
            fields.append(f"{k} = ?")
            values.append(updates[k])
    if fields:
        values.append(user_id)
        with get_db() as conn:
            conn.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", values)
            conn.commit()
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")
    return user


# Auto-initialize DB
init_db()
