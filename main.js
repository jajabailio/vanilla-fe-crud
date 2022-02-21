let selectedUserId = "";

async function updateUser() {
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const email = document.getElementById("email").value;

	try {
		// await axios.put("http://localhost:3000/api/users/" + selectedUserId, { firstName, lastName, email });
		await axios({
			method: "put",
			url: "http://localhost:3000/api/users/" + selectedUserId,
			data: { firstName, lastName, email },
		});

		const firstNameField = document.querySelector("#row-" + selectedUserId + " td:nth-child(2)");
		const lastNameField = document.querySelector("#row-" + selectedUserId + " td:nth-child(3)");
		const emailField = document.querySelector("#row-" + selectedUserId + " td:nth-child(4)");

		firstNameField.innerHTML = firstName;
		lastNameField.innerHTML = lastName;
		emailField.innerHTML = email;
	} catch (err) {
		console.error(err);
		alert("Something failed");
	}

	closeModal();
}

function closeModal() {
	const modalElement = document.getElementById("userModal");
	const modal = bootstrap.Modal.getInstance(modalElement);
	modal.hide();
	document.getElementById("modalSubmitBtn").innerHTML = "Save";

	selectedUserId = "";
	document.getElementById("firstName").value = "";
	document.getElementById("lastName").value = "";
	document.getElementById("email").value = "";
}

function onFormSubmit() {
	if (selectedUserId !== "") updateUser();
	else saveUser();
}

async function saveUser() {
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const email = document.getElementById("email").value;

	try {
		const { data } = await axios.post("http://localhost:3000/api/users", { firstName, lastName, email });
		const tableBody = document.getElementById("table-body");

		const userUpdate = encodeURIComponent(JSON.stringify(data));

		const appendData = `
			<tr>
				<td>${data._id}</td>
				<td>${data.firstName}</td>
				<td>${data.lastName}</td>
				<td>${data.email}</td>
				<td>
					<button class="btn btn-warning" type="button" onclick="fillFormForUpdate('${userUpdate}')" data-bs-toggle="modal" data-bs-target="#userModal">Update</button> | 
					<button class="btn btn-danger" onclick="deleteUser('${data._id}')">Delete</button>
				</td>
			</tr>
		`;

		tableBody.innerHTML += appendData;

		closeModal();
	} catch (err) {
		console.error(err);
		alert("Something failed");
	}
}

async function loadUsers() {
	let tableBodyContent = "";

	try {
		const { data: users } = await axios.get("http://localhost:3000/api/users");
		users.forEach(user => {
			const userUpdate = encodeURIComponent(JSON.stringify(user));
			tableBodyContent += `
			<tr id="row-${user._id}">
				<td>${user._id}</td>
				<td>${user.firstName}</td>
				<td>${user.lastName}</td>
				<td>${user.email}</td>
				<td class="w-25">
					<button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#userModal" onclick="fillFormForUpdate('${userUpdate}')">Update</button> | 
					<button class="btn btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
				</td>
			</tr>
		`;
		});
	} catch (err) {
		console.error(err);
		alert("Something failed");
	}

	const tableBody = document.getElementById("table-body");
	tableBody.innerHTML = tableBodyContent;
}

function fillFormForUpdate(userPayload) {
	document.getElementById("modalSubmitBtn").innerHTML = "Update";
	const user = JSON.parse(decodeURIComponent(userPayload));
	document.getElementById("firstName").value = user.firstName;
	document.getElementById("lastName").value = user.lastName;
	document.getElementById("email").value = user.email;

	selectedUserId = user._id;
}

async function deleteUser(userId) {
	try {
		await axios.delete("http://localhost:3000/api/users/" + userId);
		const userElement = document.getElementById("row-" + userId);
		userElement.remove();
	} catch (err) {
		console.error(err);
		alert("Something failed");
	}
}

loadUsers();
