"""Delete Dones model

Revision ID: 76b30c4ba82c
Revises: 57a0b979e95d
Create Date: 2023-06-17 17:39:18.930320

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '76b30c4ba82c'
down_revision = '57a0b979e95d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('dones')
    with op.batch_alter_table('todos', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_done', sa.Boolean(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('todos', schema=None) as batch_op:
        batch_op.drop_column('is_done')

    op.create_table('dones',
    sa.Column('done_id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('todo_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['todo_id'], ['todos.todo_id'], name='dones_todo_id_fkey'),
    sa.PrimaryKeyConstraint('done_id', name='dones_pkey')
    )
    # ### end Alembic commands ###
