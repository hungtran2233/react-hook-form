import React, { useEffect, useState } from "react";
import Form from "./Form";
import SearchForm from "./SearchForm";
import StudentList from "./StudentList";
// CSS
import styleHome from "./home.module.css";

function Home() {
	const [studentList, setStudentList] = useState([]);

	function createStudent(student) {
		const foundStudent = studentList.find((item) => {
			return item.studentId === student.studentId;
		});
		if (foundStudent)
			return alert("Mã sinh viên đã tồn tại, vui lòng nhập lại!");
		setStudentList([...studentList, student]);
	}

	function deleteStudent(id) {
		const cloneStudentList = [...studentList];
		const index = cloneStudentList.findIndex((item) => item.studentId === id);
		if (index === -1) return;
		cloneStudentList.splice(index, 1);
		setStudentList(cloneStudentList);
	}

	// Update: Bước 1
	const [selectedStudent, setSelectedStudent] = useState(null);

	function getUpdateStudent(student) {
		setSelectedStudent(student);
	}

	// Update: Bước 2
	function updateStudent(student) {
		const cloneStudentList = [...studentList];
		const index = cloneStudentList.findIndex(
			(item) => item.studentId === student.studentId
		);
		if (index === -1) return;
		cloneStudentList[index] = student;

		setStudentList(cloneStudentList);
		setSelectedStudent(null);
	}

	// Search
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResult, setSearchResult] = useState([]);

	const searchHandler = (searchTerm) => {
		setSearchTerm(searchTerm);
		if (searchTerm !== "") {
			const newStudentList = studentList.filter((item) => {
				return Object.values(item)
					.join(" ")
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			});

			setSearchResult(newStudentList);
		} else {
			setSearchResult(studentList);
		}
	};

	function renderSearch() {
		return searchResult.map((student, index) => {
			return (
				<tr key={index}>
					<td>{student.studentId}</td>
					<td>{student.name}</td>
					<td>{student.phone}</td>
					<td>{student.email}</td>
				</tr>
			);
		});
	}

	return (
		<div>
			<h1 style={{ textAlign: "center" }}>Quản Lý Sinh Viên</h1>

			<Form
				createStudent={createStudent}
				selectedStudent={selectedStudent}
				updateStudent={updateStudent}
			/>

			<StudentList
				studentList={studentList}
				deleteStudent={deleteStudent}
				getUpdateStudent={getUpdateStudent}
				term={searchTerm}
				searchKeyword={searchHandler}
			/>

			<div className={styleHome.searchContent}>
				<table className={styleHome.table}>
					<thead>
						<tr>
							<th>Mã SV</th>
							<th>Tên SV</th>
							<th>Số Điện Thoại</th>
							<th>Email</th>
						</tr>
					</thead>
					<tbody>{renderSearch()}</tbody>
				</table>
			</div>
		</div>
	);
}

export default Home;
