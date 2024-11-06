
let entries = JSON.parse(localStorage.getItem('entries')) || [];
let filteredEntries = [...entries];
let currentPage = 1;
let editingEntry = false;
const itemsPerPage = 5;
let sortOrder = { firstName: 'asc', lastName: 'asc', dob: 'asc', age: 'asc' };
let lastSortedField = 'firstName';
let isSorted = false;




// Sorting function with icon change logic
function updateSorting(field, headerId) {
    lastSortedField = field;
    isSorted = true;
    // Toggle sort order between ascending and descending
    const order = sortOrder[field] === 'asc' ? 'desc' : 'asc';
    sortOrder[field] = order;
    filteredEntries = sortEntries(filteredEntries, field, order);

    // Update the sorting icon based on the order
    const header = document.getElementById(headerId);
    const img = header.querySelector('img');
    img.src = order === 'asc' ? 'drop-down.png' : 'drop-up.png';

    // Reset other headers' icons to default
    ['firstNameHeader', 'lastNameHeader', 'dobHeader', 'ageHeader'].forEach(id => {
        if (id !== headerId) {
            const otherImg = document.getElementById(id).querySelector('img');
            otherImg.src = 'drop-down.png';
        }
    });

    // Display the updated entries after sorting
    displayEntries(filteredEntries);
}

// Event listeners for sorting headers
document.getElementById('firstNameHeader').addEventListener('click', () => updateSorting('firstName', 'firstNameHeader'));
document.getElementById('lastNameHeader').addEventListener('click', () => updateSorting('lastName', 'lastNameHeader'));
document.getElementById('dobHeader').addEventListener('click', () => updateSorting('dob', 'dobHeader'));
document.getElementById('ageHeader').addEventListener('click', () => updateSorting('age', 'ageHeader'));

// Sorting function
function sortEntries(entries, field, order) {
    return entries.sort((a, b) => {
        if (field === 'age') {
            return order === 'asc' ? a.age - b.age : b.age - a.age;
        }
        if (order === 'asc') {
            return a[field].localeCompare ? a[field].localeCompare(b[field]) : a[field] - b[field];
        } else {
            return b[field].localeCompare ? b[field].localeCompare(a[field]) : b[field] - a[field];
        }
    });
}

// Real-time validation listeners
document.getElementById('firstName').addEventListener('input', validateFirstName);
document.getElementById('lastName').addEventListener('input', validateLastName);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);
document.getElementById('phone').addEventListener('input', validatePhone);
document.getElementById('dob').addEventListener('input', validateDOB);

function validateFirstName() {
    const firstName = document.getElementById('firstName').value.trim();
    const errorElement = document.getElementById('firstNameError');
    if (firstName.length === 0) {
        errorElement.textContent = 'First name is required.';
    } else if (firstName.length < 2 || firstName.length > 50) {
        errorElement.textContent = 'First name must be between 2 and 50 characters.';
    } else {
        errorElement.textContent = '';
    }
}

function validateLastName() {
    const lastNamme = document.getElementById('lastName').value.trim();
    const errorElement = document.getElementById('lastNameError');
    if (lastName.length === 0) {
        errorElement.textContent = 'Last name is required';
    } else if (lastName.length < 2 || lastName.length > 50) {
        errorElement.textContent = 'Last name must be between 2 and 50 characters.';
    } else {
        errorElement.textContent = '';
    }
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const errorElement = document.getElementById('emailError');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) {
        errorElement.textContent = 'Email is required';
    } else if (!regexEmail.test(email)) {
        errorElement.textContent = 'Invalid email format.';
    } else {
        errorElement.textContent = '';
    }
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('passwordError');
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (password.length === 0) {
        errorElement.textContent = 'Password is required';
    } else if (!regexPassword.test(password)) {
        errorElement.textContent = 'Password must be at least 8 characters, with uppercase, lowercase, number, and special character.';
    } else {
        errorElement.textContent = '';
    }
}

function validatePhone() {
    const phone = document.getElementById('phone');
    const phoneValue = phone.value.replace(/\D/g, '');
    const errorElement = document.getElementById('phoneError');
    const regexPhone = /^[0-9]{10}$/;

    if (phoneValue.length === 0) {
        errorElement.textContent = 'Phone number is required.';
    } else if (!regexPhone.test(phoneValue)) {
        errorElement.textContent = 'Phone number must be exactly 10 digits.';
    } else {
        errorElement.textContent = '';
    }
    phone.value = phoneValue;
}

function validateDOB() {
    const dob = document.getElementById('dob').value;
    const errorElement = document.getElementById('dobError');
    if (!dob) {
        errorElement.textContent = 'Date of birth is required.';
    } else {
        errorElement.textContent = '';
        calculateAge();
    }
}

function calculateAge() {
    const dob = new Date(document.getElementById('dob').value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    document.getElementById('age').value = age;
}

// Filter by date
document.getElementById('filterButton').addEventListener('click', filterEntriesByDateRange);
document.getElementById('resetButton').addEventListener('click', resetDateFilter);

function filterEntriesByDateRange() {
    const fromDate = new Date(document.getElementById('fromDate').value);
    const toDate = new Date(document.getElementById('toDate').value);

    if (!isNaN(fromDate) && !isNaN(toDate)) {
        filteredEntries = entries.filter(entry => {
            const entryDate = new Date(entry.dob);
            return entryDate >= fromDate && entryDate <= toDate;
        });
        currentPage = 1;
        displayEntries(filteredEntries);
    } else {
        alert("Please select both from and to dates.");
    }
}

function resetDateFilter() {
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    filteredEntries = [...entries];
    currentPage = 1;
    displayEntries(filteredEntries);
}

// Real-time search
document.getElementById('searchInput').addEventListener('input', () => {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm === "") {
        filteredEntries = [...entries];
    } else {
        currentPage = 1;
        filteredEntries = entries.filter(entry =>
            entry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.phone.includes(searchTerm)
        );
    }
    displayEntries(filteredEntries);
});

function displayEntries(filteredEntries) {
    const entriesBody = document.getElementById('entriesBody');
    entriesBody.innerHTML = '';


    if (filteredEntries.length == 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = `<td style="text-align:center" colspan ='10'> No Data Found`;
        entriesBody.appendChild(noDataRow);
    } else {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredEntries.length);

        for (let i = startIndex; i < endIndex; i++) {
            const entry = filteredEntries[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${entry.firstName}</td>
                    <td>${entry.lastName}</td>
                    <td>${entry.dob}</td>
                    <td>${entry.age}</td>
                    <td>${entry.email}</td>
                    <td>${entry.phone}</td>
                    <td>${entry.address}</td>
                    <td>${entry.createdAt}</td>
                    <td><span class="edit-btn" onclick="editEntry(${i})" ${editingEntry ? 'style="pointer-events: none; color: gray;"' : ''}>Edit</span></td>
                    <td><span class="delete-btn" onclick="deleteEntry(${i})" ${editingEntry ? 'style="pointer-events: none; color: gray;"' : ''}>Delete</span></td>
                `;
            entriesBody.appendChild(row);
        }
    }
    updatePaginationControls(filteredEntries);
}

function updatePaginationControls(filteredEntries) {
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;

    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageSpan = document.createElement('span');
        pageSpan.textContent = i;
        pageSpan.className = i === currentPage ? 'current-page' : '';
        pageSpan.style.cursor = 'pointer';
        pageSpan.onclick = function () {
            currentPage = i;
            displayEntries(filteredEntries);
        };
        pageNumbers.appendChild(pageSpan);
    }
}

document.getElementById('prevPage').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        displayEntries(filteredEntries);
    }
});

document.getElementById('nextPage').addEventListener('click', function () {
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayEntries(filteredEntries);
    }
});

function editEntry(index) {
    const mainIndex = entries.findIndex(entry => entry.createdAt === filteredEntries[index].createdAt);

    if (mainIndex !== -1) {
        const entry = entries[mainIndex];

        document.getElementById('firstName').value = entry.firstName;
        document.getElementById('lastName').value = entry.lastName;
        document.getElementById('dob').value = entry.dob;
        document.getElementById('age').value = entry.age;
        document.getElementById('email').value = entry.email;
        document.getElementById('phone').value = entry.phone;
        document.getElementById('password').value = entry.password;
        document.getElementById('address').value = entry.address;
        document.getElementById('entryIndex').value = mainIndex;
        document.getElementById('submitButton').textContent = "Update";

        editingEntry = true;
        displayEntries(filteredEntries);
    }
}

function deleteEntry(index) {
    const entryToDelete = filteredEntries[index];
    const mainIndex = entries.findIndex(entry => entry.createdAt === entryToDelete.createdAt);

    if (mainIndex === parseInt(document.getElementById('entryIndex').value, 10)) {
        alert("you can not delete when you are edit it.");
        return;
    }

    if (mainIndex !== -1) {
        entries.splice(mainIndex, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    filteredEntries = [...entries];
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    displayEntries(filteredEntries);
}

document.getElementById('dataForm').addEventListener('submit', function (event) {
    event.preventDefault();
    validateFirstName();
    validateLastName();
    validateEmail();
    validatePassword();
    validatePhone();
    validateDOB();

    const errors = document.querySelectorAll('.error');
    let hasError = false;
    errors.forEach(error => {
        if (error.textContent !== '') {
            hasError = true;
        }
    });

    if (hasError) return;

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        dob: document.getElementById('dob').value,
        age: document.getElementById('age').value,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
        address: document.getElementById('address').value.trim(),
        createdAt: new Date().toLocaleString()
    };

    const entryIndex = document.getElementById('entryIndex').value;

    if (entryIndex === "") {
        entries.push(formData);
    } else {
        const index = parseInt(entryIndex, 10);
        entries[index] = formData;
        document.getElementById('entryIndex').value = "";
        document.getElementById('submitButton').textContent = "Submit";
    }

    localStorage.setItem('entries', JSON.stringify(entries));
    this.reset();
    editingEntry = false;
    // filteredEntries = [...entries];
    // displayEntries(filteredEntries);
    applyCurrentFilter();
});

function applyCurrentFilter() {
    const fromDate = new Date(document.getElementById('fromDate').value);
    const toDate = new Date(document.getElementById('toDate').value);
    const searchTerm = document.getElementById('searchInput').value.trim();

    if (!isNaN(fromDate) && !isNaN(toDate)) {
        filteredEntries = entries.filter(entry => {
            const entryDate = new Date(entry.dob);
            return entryDate >= fromDate && entryDate <= toDate;
        });
    } else {
        filteredEntries = [...entries];
    }

    if (searchTerm !== "") {
        filteredEntries = filteredEntries.filter(entry =>
            entry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.phone.includes(searchTerm)
        );
    }
    if (isSorted) {
        filteredEntries = sortEntries(filteredEntries, lastSortedField, sortOrder[lastSortedField]);
    }
    displayEntries(filteredEntries);
}
displayEntries(filteredEntries);
