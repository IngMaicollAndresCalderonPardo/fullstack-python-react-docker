from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.post import Post
from app.schemas.post import PostCreate, PostOut
from app.schemas.user import UserOut  # Importamos el schema del usuario
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_in: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    post = Post(
        title=post_in.title,
        content=post_in.content,
        user_id=current_user.id 
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post

@router.get("/", response_model=List[PostOut])
async def list_posts(
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    result = await db.execute(select(Post).where(Post.user_id == current_user.id))
    return result.scalars().all()

@router.get("/{post_id}", response_model=PostOut)
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    result = await db.execute(
        select(Post).where(Post.id == post_id, Post.user_id == current_user.id)
    )
    post = result.scalars().first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    result = await db.execute(
        select(Post).where(Post.id == post_id, Post.user_id == current_user.id)
    )
    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    await db.delete(post)
    await db.commit()
    return None
