"""add models

Revision ID: ad609ffc61f3
Revises: 869d62224e6d
Create Date: 2024-07-21 10:52:37.447604

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ad609ffc61f3'
down_revision = '869d62224e6d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('iot_device',
    sa.Column('longitude', sa.Float(), nullable=False),
    sa.Column('latitude', sa.Float(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('id_device', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('id_user', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['id_user'], ['user.id_user'], ),
    sa.PrimaryKeyConstraint('id_device')
    )
    op.create_table('water_data',
    sa.Column('id_water_data', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('id_device', sa.Integer(), nullable=True),
    sa.Column('flow_rate', sa.Float(), nullable=True),
    sa.Column('water_level', sa.Float(), nullable=True),
    sa.Column('pump_status', sa.String(length=50), nullable=True),
    sa.Column('quantity', sa.Float(), nullable=True),
    sa.Column('rainfall', sa.Float(), nullable=True),
    sa.Column('temperature', sa.Float(), nullable=True),
    sa.Column('humidity', sa.Float(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['id_device'], ['iot_device.id_device'], ),
    sa.PrimaryKeyConstraint('id_water_data')
    )
    op.create_table('water_quality',
    sa.Column('id_water_quality', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('id_device', sa.Integer(), nullable=True),
    sa.Column('ph', sa.Float(), nullable=True),
    sa.Column('hardness', sa.Float(), nullable=True),
    sa.Column('solids', sa.Float(), nullable=True),
    sa.Column('chloramines', sa.Float(), nullable=True),
    sa.Column('sulfate', sa.Float(), nullable=True),
    sa.Column('conductivity', sa.Float(), nullable=True),
    sa.Column('organic_carbon', sa.Float(), nullable=True),
    sa.Column('trihalomethanes', sa.Float(), nullable=True),
    sa.Column('turbidity', sa.Float(), nullable=True),
    sa.Column('potability', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['id_device'], ['iot_device.id_device'], ),
    sa.PrimaryKeyConstraint('id_water_quality')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('water_quality')
    op.drop_table('water_data')
    op.drop_table('iot_device')
    # ### end Alembic commands ###
