"use strict";
const AGENT_CODE = "best agent 007";
const BASE_URL = "https://66e98a6387e417609449dfc5.mockapi.io/api/";
const pasangersList = document.querySelector(".passnger-list");
const selectFlights = document.querySelector(".select-flights");
const sendButton = document.querySelector(".send");
const genderMInp = document.querySelector(".M");
const genderFInp = document.querySelector(".F");
const nameInp = document.querySelector(".name");
const getPassengers = async () => {
    try {
        const res = await fetch(`${BASE_URL}pasangers/?agent=${AGENT_CODE}`);
        const pasangers = await res.json();
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return pasangers;
    }
    catch (error) {
        console.log(error);
    }
};
const getFlights = async () => {
    try {
        const res = await fetch(BASE_URL + "flights");
        const flights = await res.json();
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return flights;
    }
    catch (error) {
        console.log(error);
    }
};
const editPassengerDiv = async (pasanger, wraper, name, gender, flight, save) => {
    name.disabled = !name.disabled;
    name.classList.toggle("myinput");
    gender.disabled = !gender.disabled;
    gender.classList.toggle("myinput");
    flight.classList.toggle("myinput");
    flight.disabled = !flight.disabled;
    save.classList.toggle("disp-none");
};
const editPassenger = async (pasanger, wraper, name, gender, flight) => {
    await fetch(`${BASE_URL}pasangers/${pasanger.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: name.value,
            gender: gender.value,
            flight_id: flight.value,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((res) => console.log(res.sta));
    populatePassengers();
};
const deletPassenger = async (pasanger) => {
    const isConfirm = confirm("Are you shure you wont to delete passenger?");
    if (!isConfirm)
        return;
    await fetch(`${BASE_URL}pasangers/${pasanger.id}`, { method: "DELETE" })
        .catch(res => console.log(res.statusText));
    populatePassengers();
};
const populatePassengers = async () => {
    const pasangers = await getPassengers();
    pasangersList.innerHTML = "";
    for (const pasanger of pasangers) {
        // wraper div
        const div = document.createElement("div");
        div.classList.add("passnger");
        // id element
        const id = document.createElement("input");
        id.disabled = true;
        id.classList.add("myinput");
        id.value = `ID: ${pasanger.id}`;
        // name element
        const name = document.createElement("input");
        name.disabled = true;
        name.classList.add("myinput");
        name.value = pasanger.name;
        // gender element
        const gender = document.createElement("input");
        gender.disabled = true;
        gender.classList.add("myinput");
        gender.value = pasanger.gender;
        // // flight element
        // const flight: HTMLInputElement = document.createElement("input")
        // flight.disabled = true
        // flight.classList.add("myinput")
        // flight.value = pasanger.flight
        // flight id element
        const flight_id = document.createElement("input");
        flight_id.disabled = true;
        flight_id.classList.add("myinput");
        flight_id.value = pasanger.flight_id;
        // created at element
        const created_at = document.createElement("input");
        created_at.disabled = true;
        created_at.classList.add("myinput");
        created_at.value = pasanger.createdAt;
        // edit bttun
        const editBtn = document.createElement("div");
        editBtn.textContent = "Edit";
        editBtn.classList.add("editBtn");
        editBtn.addEventListener("click", e => editPassengerDiv(pasanger, div, name, gender, flight_id, saveEditBtn));
        // save edit button
        const saveEditBtn = document.createElement("div");
        saveEditBtn.textContent = "Save";
        saveEditBtn.classList.add("editBtn");
        saveEditBtn.classList.add("disp-none");
        saveEditBtn.addEventListener("click", e => editPassenger(pasanger, div, name, gender, flight_id));
        div.appendChild(editBtn);
        // delete button
        const deleteBtn = document.createElement("div");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("editBtn");
        deleteBtn.addEventListener("click", e => deletPassenger(pasanger));
        // add the elements to the main div
        div.appendChild(id);
        div.appendChild(name);
        div.appendChild(gender);
        div.appendChild(flight_id);
        div.appendChild(created_at);
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        div.appendChild(saveEditBtn);
        pasangersList.appendChild(div);
    }
};
const populateFlights = async () => {
    const flights = await getFlights();
    for (const flight of flights) {
        const opt = document.createElement("option");
        opt.textContent = `${flight.from} → ${flight.to} (${flight.date})`;
        opt.value = flight.id;
        selectFlights.appendChild(opt);
    }
};
const createPassengerObj = () => {
    const pasanger = {
        createdAt: Date(),
        name: nameInp.value,
        gender: genderMInp.checked ? genderMInp.value : genderFInp.value,
        flight_id: selectFlights.value,
        agent: AGENT_CODE,
    };
    return pasanger;
};
const createPassenger = async () => {
    try {
        const res = await fetch(BASE_URL + "pasangers", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createPassengerObj())
        });
        if (!res.ok) {
            throw new Error(res.status.toString());
        }
        const resBody = await res.json();
        alert(`You have successfuly created new passnger named ${resBody.name}`);
        pasangersList.innerHTML = "";
        populatePassengers();
    }
    catch (error) {
        console.log(error);
        alert("somthig went wrong! maik shuor that all filds are valid");
    }
    location.reload();
};
populatePassengers();
populateFlights();
sendButton.addEventListener("click", createPassenger);
