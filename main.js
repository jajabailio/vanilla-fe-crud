const users = [
	{
		_id: 1,
		firstName: "Janssen",
		lastName: "Bailio",
		email: "janssenbailio@sample.com",
	},
	{
		_id: 2,
		firstName: "Allie",
		lastName: "Arcillas",
		email: "alliearcillas@sample.com",
	},
	{
		_id: 3,
		firstName: "Jaime",
		lastName: "Ariston",
		email: "jaime@sample.com",
	},
];

let selectedUserId = "";

function updateUser() {
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const email = document.getElementById("email").value;

	const firstNameField = document.querySelector("#row-" + selectedUserId + " td:nth-child(2)");
	const lastNameField = document.querySelector("#row-" + selectedUserId + " td:nth-child(3)");
	const emailField = document.querySelector("#row-" + selectedUserId + " td:nth-child(4)");

	firstNameField.innerHTML = firstName;
	lastNameField.innerHTML = lastName;
	emailField.innerHTML = email;

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

function saveUser() {
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const email = document.getElementById("email").value;

	const data = { _id: users.length + 1, firstName, lastName, email };

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
}

function loadUsers() {
	let tableBodyContent = "";

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

function deleteUser(userId) {
	const userElement = document.getElementById("row-" + userId);
	userElement.remove();
}

loadUsers();

//
