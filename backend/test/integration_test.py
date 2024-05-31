import pytest
from httpx import AsyncClient
from fastapi import FastAPI
from typing import List
from app.api import app, Todo

# Dummy database simulation
db: List[Todo] = []

@pytest.fixture(scope="function")
def reset_db():
    # Ensure the dummy database is reset before each test
    db.clear()
    yield
    db.clear()

@pytest.mark.integrationtest
@pytest.mark.asyncio
async def test_read_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to your todo list."}

@pytest.mark.integrationtest
@pytest.mark.asyncio
async def test_create_todo_item(reset_db):
    assert len(db) == 0
    new_todo = {"item": "Test Todo"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/todo/", json=new_todo) 
        if response.status_code == 307:
         response = await ac.post(response.headers["location"], json=new_todo)
        assert response.status_code == 200

   
        response = await ac.get("/todo")
    assert response.status_code == 200
    response_json = response.json()
    assert any(todo['item'] == "Test Todo" for todo in response_json["data"])

@pytest.mark.integrationtest
@pytest.mark.asyncio
async def test_update_todo():
    async with AsyncClient(app=app, base_url="http://test") as ac:
    # Get the ID based on the item
        response = await ac.get("/todo")
        assert response.status_code == 200
        todos = response.json()["data"]
        todo_id = next(todo["id"] for todo in todos if todo["item"] == "Test Todo")

    # Update the todo item
        updated_todo = {"id": todo_id, "item": "Update Todo"}
        response = await ac.put(f"/todo/{todo_id}", json=updated_todo)
        assert response.status_code == 200

    # Verify that the todo item was updated
        response = await ac.get("/todo")
        assert response.status_code == 200
        response_json = response.json()
        assert any(todo['item'] == "Update Todo" for todo in response_json["data"])


@pytest.mark.integrationtest
@pytest.mark.asyncio
async def test_delete_todo():
    async with AsyncClient(app=app, base_url="http://test") as ac:
     # Get the ID based on the item
        response = await ac.get("/todo")
        assert response.status_code == 200
        todos = response.json()["data"]
        todo_id = next(todo["id"] for todo in todos if todo["item"] == "Update Todo")

    # Delete the todo item
        response = await ac.delete(f"/todo/{todo_id}")
        assert response.status_code == 200

    # Verify that the todo item was deleted
        response = await ac.get("/todo")
        assert response.status_code == 200
        response_json = response.json()
        assert not any(todo['id'] == todo_id for todo in response_json["data"])