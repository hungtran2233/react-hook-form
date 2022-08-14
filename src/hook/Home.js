import React, { useEffect, useState } from "react";
import Form from "./Form";
import UserList from "./UserList";

function Home() {
	const [userList, setUserList] = useState([]);
	//Update
	const [selectedUser, setSelectedUser] = useState(null);

	function createUser(user) {
		const foundUser = userList.find((item) => {
			return item.username === user.username;
		});
		if (foundUser) return alert("Tài khoản đã tồn tại");
		setUserList([...userList, user]);
	}

	function deleteUser(id) {
		const cloneUserList = [...userList];
		const index = cloneUserList.findIndex((item) => {
			return item.id === id;
		});
		cloneUserList.splice(index, 1);
		setUserList(cloneUserList);
	}

	// Update bước 1

	function getUpdateUser(user) {
		setSelectedUser(user);
	}

	// Update bước 2
	function updateUser(user) {
		const cloneUserList = [...userList];
		const index = cloneUserList.findIndex((item) => item.id === user.id);
		if (index === -1) return;
		cloneUserList[index] = user;

		// automatic batching
		setUserList(cloneUserList);
		setSelectedUser(null);
	}

	return (
		<div>
			<h1>Quản Lý User</h1>
			<Form
				createUser={createUser}
				selectedUser={selectedUser}
				updateUser={updateUser}
			/>
			<UserList
				users={userList}
				deleteUser={deleteUser}
				getUpdateUser={getUpdateUser}
			/>
		</div>
	);
}

export default Home;
