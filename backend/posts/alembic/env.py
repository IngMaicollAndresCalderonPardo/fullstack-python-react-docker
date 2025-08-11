from logging.config import fileConfig
from sqlalchemy import create_engine
from alembic import context
import os

from app.db.base import Base  # importa la Base
from app.models.post import Post

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
DATABASE_URL_SYNC = os.getenv("DATABASE_URL_SYNC")

def run_migrations_offline():
    context.configure(
        url=DATABASE_URL_SYNC,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = create_engine(DATABASE_URL_SYNC)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
