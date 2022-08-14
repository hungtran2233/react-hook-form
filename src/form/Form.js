import React, { useEffect, useState } from "react";
import { Card, Input, Button } from "antd";
import styles from "./form.module.css";
import * as yup from "yup";
import { isEmpty } from "lodash";

// Validation
const userSchema = yup.object().shape({
	studentId: yup.string().required("*Vui lòng nhập mã sinh viên"),
	name: yup
		.string()
		.required("*Vui lòng nhập name")
		.matches(/^[A-Za-z ]+$/g, "Họ tên phải nhập chữ"),

	phone: yup
		.string()
		.required("*Vui lòng nhập phone")
		.matches(/^[0-9]+$/g),
	email: yup
		.string()
		.required("*Vui lòng nhập email")
		.email("*Email không đúng định dạng"),
});

function Form(props) {
	const [student, setStudent] = useState({
		studentId: "",
		name: "",
		phone: "",
		email: "",
	});

	// Update sử dụng useEffect
	// Tự động chạy mỗi lần Form render lại. Mỗi lần selectedStudent của Home
	// truyền qua có thay đổi thì set lại state ở Form
	useEffect(() => {
		// Nếu chưa có student để cập nhật
		if (!props.selectedStudent) return;
		//Nếu như đang chỉnh sửa mà nhấn chỉnh sửa chính nó 1 lần nữa thì nó không làm gì hết
		if (props.selectedStudent.studentId === student.studentId) return;
		setStudent(props.selectedStudent);
	}, [props.selectedStudent]);

	function handleChange(e) {
		setStudent({ ...student, [e.target.name]: e.target.value });
	}

	async function handleSubmit(e) {
		//Validation
		e.preventDefault();
		const isValid = await validateForm();
		if (!isValid) return;

		if (props.selectedStudent) {
			props.updateStudent(student);
		} else {
			props.createStudent({ ...student });
		}
		resetForm();
	}

	// Reset form
	function resetForm() {
		setStudent({
			studentId: "",
			name: "",
			phone: "",
			email: "",
		});
		setErrors({}); // Bỏ đi thông báo lỗi
	}

	/////////////////////
	// Validation
	const [errors, setErrors] = useState([]);

	async function validateForm() {
		const validationErrors = {};
		try {
			await userSchema.validate(student, {
				abortEarly: false,
			});
		} catch (err) {
			const errObj = { ...err };

			errObj.inner.forEach((validationError) => {
				if (validationErrors[validationError.path]) return;
				validationErrors[validationError.path] = validationError.message;
			});

			setErrors(validationErrors);
		}

		return isEmpty(validationErrors);
	}

	return (
		<div>
			<Card
				title="Thông Tin Sinh Viên"
				headStyle={{ backgroundColor: "#000", color: "#fff" }}
			>
				<form className={styles.form}>
					<div className={styles.formGroup}>
						<label>Mã SV</label>
						<Input
							onChange={handleChange}
							name="studentId"
							value={student.studentId}
							placeholder="Nhập mã sinh viên..."
						/>
						<span className={styles.textError}>{errors.studentId}</span>
					</div>

					<div className={styles.formGroup}>
						<label>Họ Tên</label>
						<Input
							onChange={handleChange}
							name="name"
							value={student.name}
							placeholder="Nhập họ tên..."
						/>
						<span className={styles.textError}>{errors.name}</span>
					</div>

					<div className={styles.formGroup}>
						<label>Số Điện Thoại</label>
						<Input
							onChange={handleChange}
							name="phone"
							value={student.phone}
							placeholder="Nhập số điện thoại..."
						/>
						<span className={styles.textError}>{errors.phone}</span>
					</div>

					<div className={styles.formGroup}>
						<label>Email</label>
						<Input
							onChange={handleChange}
							name="email"
							value={student.email}
							placeholder="Nhập email..."
						/>
						<span className={styles.textError}>{errors.email}</span>
					</div>

					<div className={styles.btn}>
						<Button onClick={handleSubmit} type="primary">
							Thêm Sinh Viên
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}

export default Form;
