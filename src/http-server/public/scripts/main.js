const databaseListLineTemplate = (id, name, host, port, user) => {
    return `
        <tr id="${id}" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
                ${name}
            </th>
            <td class="px-6 py-4">${host}</td>
            <td class="px-6 py-4">${port}</td>
            <td class="px-6 py-4">${user}</td>
            <td class="px-6 py-4 flex flex-row gap-3 items-center h-full">
                <div target-database-id="${id}" class="update-database-button font-medium hover:cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">Edit</div>
                <div target-database-id="${id}" class="delete-database-button font-medium hover:cursor-pointer text-red-600 dark:text-red-500 hover:underline">Delete</div>
            </td>
        </tr>
      `;
}

const deleteDatabase = async (id) => {
    const response = await fetch(`/api-admin/databases/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        console.error(response.error);
        return;
    }

    const data = await response.json();

    if (!data.status) {
        alert(data.message);
        console.error(data.error);
        return;
    }

    return true;
}


const refreshDatabaseList = async () => {
    const response = await fetch("/api-admin/databases", {
        method: "GET",
    });

    if (!response.ok) {
        console.error(data.error);
        return;
    }

    const data = await response.json();

    if (!data.status) {
        alert(data.message);
        console.error(data.error);
        return;
    }

    const databaseListBody = document.getElementById("database-list-body");
    databaseListBody.innerHTML = "";

    data?.servers?.forEach((database) => {
        let newNode = document.createElement("tr");
        newNode.innerHTML = databaseListLineTemplate(database.id, database.name, database.host, database.port, database.user);
        databaseListBody.appendChild(newNode);
    })
}






document.addEventListener("DOMContentLoaded", () => {
    // event listener for delete button
    window.deleteCookie = (name) => {
        document.cookie =
            name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };

    // Delete cookies and redirect to login page (Logout Function).
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", () => {
        deleteCookie("admin-auth");
        window.location.href = "/login";
    });






    // Refresh button and refresh on load.
    const refreshButton = document.getElementById("refresh-button");
    refreshButton.addEventListener("click", refreshDatabaseList);
    refreshDatabaseList();




    // Create new database button
    $("#add-button").click(function () {
        $("#add-new-database-modal").fadeIn(100);
    });

    $("#closeModal,#closeModalFooter").click(function () {
        $("#add-new-database-modal").fadeOut(100);
    });

    $("#add-new-database-modal").submit(function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        console.log(formData.get("name"));

        fetch("/api-admin/databases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.get("name"),
                host: formData.get("host"),
                port: formData.get("port"),
                user: formData.get("username"),
                pass: formData.get("password"),
                type: formData.get("type"),
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    console.error(response.error);
                    return;
                }

                return response.json();
            })
            .then((data) => {
                if (!data.status) {
                    alert(data.message);
                    console.error(data.error);
                    return;
                }

                refreshDatabaseList();
            });

        $("#add-new-database-modal").fadeOut(100);
    });

    // Update database button
    $("#database-list-body").click(function (event) {
        if (event.target.hasAttribute("target-database-id")) {
            const isEditButton = event.target.classList.contains("update-database-button")

            if (!isEditButton)
                return null;

            const databaseId = event.target.getAttribute("target-database-id");


            fetch(`/api-admin/databases/${databaseId}`, {
                method: "GET",
            })
                .then((response) => {
                    if (!response.ok) {
                        console.error(response.error);
                        return;
                    }

                    return response.json();
                })
                .then((data) => {
                    if (!data.status) {
                        alert(data.message);
                        return;
                    }

                    const database = data.server;


                    $("#update-database-modal input[name='name']").val(database.name);
                    $("#update-database-modal input[name='host']").val(database.host);
                    $("#update-database-modal input[name='port']").val(database.port);
                    $("#update-database-modal input[name='username']").val(database.user);
                    $("#update-database-modal input[name='password']").val(database.pass);
                    $("#update-database-modal input[name='type']").val(database.type);
                    $("#update-database-modal input[name='id']").val(database.id);

                    $("#update-database-modal").fadeIn(100);
                });



        }
    });

    $("#updateModalForm").submit(function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        fetch(`/api-admin/databases/${formData.get("id")}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.get("name"),
                host: formData.get("host"),
                port: formData.get("port"),
                user: formData.get("username"),
                pass: formData.get("password"),
                type: formData.get("type"),
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    console.error(response.error);
                    return;
                }

                return response.json();
            })
            .then((data) => {

                if (!data.status) {
                    alert(data.message);
                    console.error(data.error);
                    return;
                }

                refreshDatabaseList();
            });

        $("#update-database-modal").fadeOut(100);
    });

    $("#closeUpdateModal, #closeUpdateModalFooter").click(function () {
        $("#update-database-modal").fadeOut(100);
    });



    // Delete database button
    $("#database-list-body").click(function (event) {
        if (event.target.hasAttribute("target-database-id")) {
            const isDeleteButton = event.target.classList.contains("delete-database-button")

            if (!isDeleteButton)
                return null;

            $.confirm({
                title: "Confirm!",
                content: "Are you sure you want to delete this database?",
                buttons: {
                    confirm: async function () {
                        await deleteDatabase(event.target.getAttribute("target-database-id") ?? -1);
                        await refreshDatabaseList();
                    },
                    cancel: function () {
                    },
                },
            });
        }
    });
});