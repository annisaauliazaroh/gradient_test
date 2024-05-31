import os
import pytest
from httpx import AsyncClient
from app.api import app
import json
from jsonschema import validate, ValidationError

@pytest.fixture
def load_schema():
    schema_path = os.path.join(os.path.dirname(__file__), "schema.json")
    with open(schema_path) as f:
        schema = json.load(f)
    return schema


@pytest.mark.unittest
@pytest.mark.asyncio
async def test_get_todos(load_schema):
    
    schema = load_schema

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/todo")
    assert response.status_code == 200
    # Example data to validate
    valid_data = {"data": [
        {
        "id": "fe08d136-d501-4ada-8d3a-1a3cba6e4055",
        "item": "Read a book."
        },
        {
        "id": "59d62fc1-58d7-4284-b72e-18f5d1ac3c9a",
        "item": "Cycle around town."
        }]
    }   
    invalid_data = {"data": [
        {
        "id": "",
        "item": "Read a book."
        },
        {
        "id": "",
        "item": "Cycle around town."
        }]
    }   

    # Validate valid data
    try:
        validate(instance=valid_data, schema=schema)
    except pytest.raises(ValidationError) as e:
        pytest.fail(f"Valid data failed validation: {e}")

    # Validate invalid data
    try:
        validate(instance=invalid_data, schema=schema)
    except ValidationError as e:
        print(f"Invalid data correctly failed validation: {e}")


@pytest.mark.unittest
@pytest.mark.asyncio
async def test_add_todo():
    new_todo = {"item": "Buy groceries"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/todo", json=new_todo)
    assert response.status_code == 200
    
    # Verify the new todo has been added
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/todo")
    assert response.status_code == 200
    response_json = response.json()
    assert any(todo['item'] == "Buy groceries" for todo in response_json["data"])


@pytest.mark.unittest
@pytest.mark.asyncio
async def test_update_todo():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # First, add a new todo item to ensure we have a known item to update
        new_todo = {"item": "Go running"}
        response = await ac.post("/todo", json=new_todo)
        assert response.status_code == 200

        # Get the ID based on the item
        response = await ac.get("/todo")
        assert response.status_code == 200
        todos = response.json()["data"]
        todo_id = next(todo["id"] for todo in todos if todo["item"] == "Go running")

        # Update the todo item
        updated_todo = {"id": todo_id, "item": "Go running in the park"}
        response = await ac.put(f"/todo/{todo_id}", json=updated_todo)
        assert response.status_code == 200

        # Verify that the todo item was updated
        response = await ac.get("/todo")
        assert response.status_code == 200
        response_json = response.json()
        assert any(todo['item'] == "Go running in the park" for todo in response_json["data"])

@pytest.mark.unittest
@pytest.mark.asyncio
async def test_delete_todo():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # First, add a new todo item to ensure we have a known item to delete
        new_todo = {"item": "Do the laundry"}
        response = await ac.post("/todo", json=new_todo)
        assert response.status_code == 200

        # Get the ID based on the item
        response = await ac.get("/todo")
        assert response.status_code == 200
        todos = response.json()["data"]
        todo_id = next(todo["id"] for todo in todos if todo["item"] == "Do the laundry")

        # Delete the todo item
        response = await ac.delete(f"/todo/{todo_id}")
        assert response.status_code == 200

        # Verify that the todo item was deleted
        response = await ac.get("/todo")
        assert response.status_code == 200
        response_json = response.json()
        assert not any(todo['id'] == todo_id for todo in response_json["data"])
