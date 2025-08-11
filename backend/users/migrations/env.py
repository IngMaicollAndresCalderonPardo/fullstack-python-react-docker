from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
import asyncio

from app.core.config import settings
from app.db.session import Base

# Importa todos los modelos para que Alembic los detecte
from app.models import user

# Configuración de logging de Alembic
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Configura la URL desde settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Metadata de todos los modelos
target_metadata = Base.metadata


def run_migrations_offline():
    """Ejecuta migraciones en modo offline."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    """Función sync que ejecuta las migraciones."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online():
    """Ejecuta migraciones en modo online (async)."""
    connectable = create_async_engine(
        settings.DATABASE_URL,
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
