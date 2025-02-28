import psycopg
from app.core.config import settings
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_postgres_connection():
    """
    Context manager for PostgreSQL database connection.
    """
    conn = await psycopg.AsyncConnection.connect(settings.POSTGRES_URI)
    try:
        yield conn
    finally:
        await conn.close()

@asynccontextmanager
async def get_postgres_cursor():
    """
    Context manager for PostgreSQL database cursor.
    """
    async with get_postgres_connection() as conn:
        async with conn.cursor() as cur:
            yield cur

async def init_postgres():
    """
    Initialize PostgreSQL database with required tables.
    """
    async with get_postgres_cursor() as cur:
        # Create users table
        await cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            role VARCHAR(20) NOT NULL,
            country VARCHAR(50),
            did VARCHAR(100) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Create did table
        await cur.execute("""
        CREATE TABLE IF NOT EXISTS did (
            id SERIAL PRIMARY KEY,
            did VARCHAR(100) UNIQUE NOT NULL,
            user_id INTEGER REFERENCES users(id),
            public_key TEXT NOT NULL,
            status VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP
        )
        """)
        
        # Create audit_logs table
        await cur.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            action VARCHAR(100) NOT NULL,
            resource_type VARCHAR(50),
            resource_id VARCHAR(100),
            details JSONB,
            ip_address VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
