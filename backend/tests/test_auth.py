import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_and_login(client: AsyncClient):
    # Test Register
    reg_resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "newuser@example.com", "password": "securepassword123"}
    )
    assert reg_resp.status_code == 201
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "newuser@example.com"

    # Test Duplicate Register
    dup_resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "newuser@example.com", "password": "securepassword123"}
    )
    assert dup_resp.status_code == 400

    # Test Login JSON
    login_resp = await client.post(
        "/api/v1/auth/login/json",
        json={"email": "newuser@example.com", "password": "securepassword123"}
    )
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()

    # Test Get Me
    token = login_resp.json()["access_token"]
    me_resp = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "newuser@example.com"
