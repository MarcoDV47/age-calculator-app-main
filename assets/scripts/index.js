const inputs = document.querySelectorAll("input[type='number']");
const dayInput = inputs[0];
const monthInput = inputs[1];
const yearInput = inputs[2];
const spans = document.querySelectorAll("h2 span");
const button = document.querySelector("button");
button.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateDate()) getDate(...inputs);
})
const getDate = (day, month, year) => {
    const monthNumber = Number(month.value) - 1;
    const monthText = monthNumber.toString();

    const startDate = new Date(year.value, monthText, day.value);
    const endDate = Date.now();

    const timeDiff = Math.floor((endDate - startDate) / 86400000);
    const timeDiffInYears = Math.floor(timeDiff / 365);
    const timeDiffInMonths = Math.floor((timeDiff % 365) / 30);
    const timeDiffInDays = Math.floor((timeDiff % 365) % 30);
    displayDate(timeDiffInYears, timeDiffInMonths, timeDiffInDays);
}
const validateDate = () => {
    const areInputsFilled = (dayInput.value !== "" && monthInput.value !== "" && yearInput.value !== "")
    const areInputsNull = (dayInput.value <= 0 || monthInput.value <= 0)

    if (areInputsFilled && !areInputsNull) {

        validateDay();
        validateMonth();
        isInPast();
        if (!validateDay() || !validateMonth() || !isInPast()) {
            displayDate();
            return false
        }
        if (validateDay() && validateMonth() && isInPast()) {
            return true
        }

    }
    else {
        inputs.forEach(e => (e.value !== "" && e.value >= 1) ? e.parentElement.classList.remove("error") : e.parentElement.classList.add("error"));
        return false
    }
}
const setError = (index, message) => {
    if (index === "all") {
        inputs.forEach(e => e.parentElement.classList.add("error"))
        inputs[0].nextElementSibling.innerHTML = "Must be a valid date"
    } else {
        inputs[index].parentElement.classList.add("error");
        document.querySelectorAll(".input-data p")[index].innerHTML = message
    }
}
const setSuccess = (index) => {
    if (index === "all") {
        inputs.forEach(e => {
            e.parentElement.classList.remove("error");
            e.nextElementSibling.innerHTML = ""
        })
    } else {
        inputs[index].parentElement.classList.remove("error");
        inputs[index].nextElementSibling.innerHTML = ""
    }
}
const isLeapYear = (year) => {
    if (year % 4 === 0 && year % 100 !== 0) return true;
    else if (year % 100 === 0 && year % 400 === 0) return true;
    else return false;
}
const validateDay = () => {
    const months31 = ["1", "3", "5", "7", "8", "10", "12"]
    const months30 = ["4", "6", "9", "11"]
    if (dayInput.value > 31) {
        if (monthInput.nextElementSibling.innerHTML == "") {
            setSuccess(1)
        }
        setError(0, "Must be a valid day");
        return false
    }
    else if (months31.includes(monthInput.value) && dayInput.value > 31) {
        setError("all");
        return false
    }
    else if (months30.includes(monthInput.value) && dayInput.value > 30) {
        setError("all");
        return false
    } else {
        setSuccess(0);
        return true
    }
}
const validateMonth = () => {
    if (monthInput.value > 12) {
        setError(1, "Must be a valid month");
        return false
    }
    else if ((monthInput.value == 2 && dayInput.value > 28)) {
        if (isLeapYear(yearInput.value)) {
            if (dayInput.value <= 29) {
                setSuccess("all")
                return true
            } else if (dayInput.value > 31) {
                setSuccess(1);
                return false
            }
            else {
                setSuccess("all"); setError(1, "...In a valid month");
                setError(0, "Must be a valid day...");
                return false
            }

        } else if (dayInput.value > 31) {
            setSuccess(1);
            setError(0, "Must be a valid day...");
            return false
        }
        else if (dayInput.value > 28) {
            setSuccess("all"); setError(1, "...In a valid month");
            setError(0, "Must be a valid day...");
            return false
        }
        else {
            setSuccess("all");
            setError("all");
            return false
        }
    } else {
        setSuccess(1)
        return true
    }
}
const displayDate = (years, months, days) => {
    if (!(years || months || days)) {
        spans[0].innerHTML = "--";
        spans[1].innerHTML = "--";
        spans[2].innerHTML = "--";
    } else {
        spans[0].innerHTML = years;
        spans[1].innerHTML = months;
        spans[2].innerHTML = days;
    }
}
const isInPast = () => {
    const newDate = new Date()
    const currYear = newDate.getFullYear();
    const currMonth = newDate.getMonth() + 1;
    const currDay = newDate.getDate();

    if (yearInput.value > currYear) {
        setError(2, "Must be in the past")
        return false
    }
    else if (yearInput.value == currYear) {
        setSuccess(2);
        if (monthInput.value > currMonth) {
            setError(1, "Must be in the past");
            return false
        } else if (dayInput.value > currDay) {
            setError(0, "Must be in the past");
            return false
        } else {
            setSuccess(2);
            return true
        }

    }
    else {
        setSuccess(2)
        return true
    }
}