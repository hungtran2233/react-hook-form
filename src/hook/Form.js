import React, { useEffect, useState } from "react";
import { Card, Input, Select, Button } from "antd";
// Icon ant design
import { UserOutlined } from "@ant-design/icons";
// Chỉnh CSS cho component
import styles from "./form.module.css";
// Cai thu vien validation
import * as yup from "yup";
const userSchema = yup.object().shape({
	username: yup.string().required("*Vui lòng nhập tài khoản"),
	name: yup
		.string()
		.required("*Vui lòng nhập name")
		.matches(/^[A-Za-z ]+$/g, "Họ tên phải nhập chữ"),

	password: yup
		.string()
		.required("Vui lòng nhập mật khẩu")
		.min(8, "*Nhập ít nhất 8 kí tự")
		.max(16, "*Nhập tối đa 16 kí tự"),
	phone: yup
		.string()
		.required("*Vui lòng nhập phone")
		.matches(/^[0-9]+$/g),
	email: yup
		.string()
		.required("*Vui lòng nhập email")
		.email("*Email không đúng định dạng"),

	role: yup.string().required("Vui lòng nhập role"),
});

function Form(props) {
	const [user, setUser] = useState({
		username: "",
		password: "",
		name: "",
		email: "",
		phone: "",
		role: "",
	});

	const [errors, setErrors] = useState([]);

	// Cần hàm để check mỗi lần form được render lại thì sẽ lấy selectedUser của Home truyền vô để kiểm tra
	// Nếu như nó có thay đổi thì sẽ lấy selectedUser này ra và set lại state user trong Form
	// ==> cần 1 hàm chạy mỗi lần component được cập nhật --> useEffect

	useEffect(() => {
		// Nếu lần đầu tiền chưa có giá trị trong selectedUser
		if (!props.selectedUser) return;
		// Nếu như đang cập nhật mà bấm vào nut submit lần nữa
		if (props.selectedUser.id === user.id) return;

		setUser(props.selectedUser);
	}, [props.selectedUser]); //eslint-disable-line

	// Hàm thêm user
	function handleChange(event) {
		// console.log(event.target.value, event.target.name);
		// Xử lý với thẻ select
		// console.log(event);
		setUser({ ...user, [event.target.name]: event.target.value });
	}

	function handleSelect(name, val) {
		setUser({ ...user, [name]: val });
	}

	async function handleSubmit(event) {
		event.preventDefault(); // chặn sự kiện khi nhấn submit sẽ load lại trang
		// Xử lí validation.
		try {
			await userSchema.validate(user, {
				abortEarly: false,
			});
		} catch (err) {
			const errObj = { ...err };
			// console.log(errObj.inner);

			// chuyển từ mảng errors sang một obj error bằng cách duyệt qua mảng error đó, sau đó lấy path làm key
			// lấy message làm value
			const validationErrors = {}; // có s
			errObj.inner.map((validationError) => {
				validationErrors[validationError.path] = validationError.message;
			});
			console.log(validationErrors);
		}

		if (props.selectedUser) {
			// Nếu như có selectedUser ==> update
			props.updateUser(user);
		} else {
			// Nếu như không có seletedUser  ==> create
			props.createUser({ ...user, id: Math.floor(Math.random() * 100 + 1) });
		}
		resetForm();
	}

	function resetForm() {
		setUser({
			username: "",
			password: "",
			name: "",
			email: "",
			phone: "",
			role: "",
		});
	}

	return (
		<Card
			title="Form Đăng Ký"
			headStyle={{
				backgroundColor: "#000",
				color: "#fff",
			}}
		>
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.formGroup}>
					<label>Tài Khoản</label>
					<Input
						value={user.username}
						onChange={handleChange}
						name="username"
						placeholder="Nhập username..."
						prefix={<UserOutlined />}
					/>
				</div>
				<div className={styles.formGroup}>
					<label>Họ Tên</label>
					<Input
						value={user.name}
						onChange={handleChange}
						name="name"
						placeholder="Nhập họ tên..."
						prefix={<UserOutlined />}
					/>
				</div>
				<div className={styles.formGroup}>
					<label>Mật Khẩu</label>
					<Input
						value={user.password}
						onChange={handleChange}
						name="password"
						placeholder="Password"
						type="password"
						prefix={<UserOutlined />}
					/>
				</div>
				<div className={styles.formGroup}>
					<label>Số Điện Thoại</label>
					<Input
						value={user.phone}
						onChange={handleChange}
						name="phone"
						placeholder="Nhập Số Điện Thoại..."
						prefix={<UserOutlined />}
					/>
				</div>
				<div className={styles.formGroup}>
					<label>Email</label>
					<Input
						value={user.email}
						onChange={handleChange}
						name="email"
						placeholder="Nhập Email..."
						prefix={<UserOutlined />}
					/>
				</div>
				<div className={styles.formGroup}>
					<label>Mã Loại Người Dùng</label>
					<Select
						value={user.role}
						onChange={(val) => handleSelect("role", val)}
						className={styles.select}
					>
						<Select.Option value="khachHang">Khách Hàng</Select.Option>
						<Select.Option value="quanTri">Quản Trị</Select.Option>
					</Select>
				</div>

				<div className={styles.btn}>
					<Button htmlType="submit" type="primary">
						Submit
					</Button>
					<Button onClick={resetForm} type="default">
						Reset
					</Button>
				</div>
			</form>
		</Card>
	);
}

export default Form;
