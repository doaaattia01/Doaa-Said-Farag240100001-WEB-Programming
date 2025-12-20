class Student {
    constructor(name, age, score) {
        this.name = name;
        this.age = age;
        this.score = score;
        Student.count++;
    }

    displayInfo() {
        return `${this.name} (Age: ${this.age}) - Score: ${this.score} - Workshop: Web Programming Workshop`;
    }

    static totalStudents() {
        return Student.count;
    }
}

Student.count = 0;


const nameInput = document.getElementById("nameInput");
const ageInput = document.getElementById("ageInput");
const scoreInput = document.getElementById("scoreInput");
const registerBtn = document.getElementById("registerBtn");

const resultDiv = document.getElementById("result");
const totalSpan = document.getElementById("total");

registerBtn.addEventListener("click", function () {
    
    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const score = scoreInput.value.trim();

    if (name === "" || age === "" || score === "") {
        alert("Please fill in all fields.");
        return;
    }

    const newStudent = new Student(name, age, score);

    const p = document.createElement("p");
    p.textContent = newStudent.displayInfo();
    resultDiv.appendChild(p);

    totalSpan.textContent = Student.totalStudents();

    nameInput.value = "";
    ageInput.value = "";
    scoreInput.value = "";
});
