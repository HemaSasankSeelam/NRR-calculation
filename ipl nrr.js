
if (sessionStorage.length === 0) {
    sessionStorage.setItem("team1Runs", "[]");
    sessionStorage.setItem("team1Overs", "[]");
    sessionStorage.setItem("team2Runs", "[]");
    sessionStorage.setItem("team2Overs", "[]");
}

window.onload = onPageLoad;

document.querySelectorAll("#overs-select input").forEach((ele) => ele.addEventListener("click", onOverChange));
document.getElementById("RNRR").addEventListener("keyup", function (event) {
    let ele = document.getElementById("RNRR");
    if (event.key === "Enter" || event.key === "Shift")
        return
    if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(event.key))
        ele.value = String(ele.value).slice(0, String(ele.value).length - 1)
});
document.getElementById("target").addEventListener("keyup", function (event) {
    let ele = document.getElementById("target");
    if (event.key === "Enter" || event.key === "Shift")
        return
    if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(event.key))
        ele.value = String(ele.value).slice(0, String(ele.value).length - 1)
});
document.getElementById("max-overs").addEventListener("keyup", function (event) {
    let ele = document.getElementById("max-overs");
    if (event.key === "Enter" || event.key === "Shift")
        return
    if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(event.key))
        ele.value = String(ele.value).slice(0, String(ele.value).length - 1)
});

document.getElementById("target-checkbox").addEventListener("click", () => {
    let ele = document.getElementById("target");
    if (ele.disabled)
        ele.disabled = false;
    else
        ele.disabled = true;
})

let team1div = document.getElementById("runs-overs-inputs-team-1");
let team2div = document.getElementById("runs-overs-inputs-team-2");

let output = document.getElementById("output");

let team1Runs = [];
let team1Overs = [];

let team2Runs = [];
let team2Overs = [];



function onOverChange(event) {

    let oversValue = "0";
    document.querySelectorAll("#overs-select input").forEach((ele) => {
        if (ele.checked) {
            oversValue = ele.value;
        }
    });
    if (oversValue == 0)
        return;

    document.querySelectorAll("#each-row-team-1 input[id='overs']").forEach((ele) => {
        if (["10", "20", "50"].includes(ele.value)) {
            ele.value = oversValue;
        }
    })

    document.querySelectorAll("#each-row-team-2 input[id='overs']").forEach((ele) => {
        if (["10", "20", "50"].includes(ele.value))
            ele.value = oversValue;
    })


}

function onPageLoad() {
    team1Runs = JSON.parse(sessionStorage.getItem("team1Runs"));
    team1Overs = JSON.parse(sessionStorage.getItem("team1Overs"));

    team2Runs = JSON.parse(sessionStorage.getItem("team2Runs"));
    team2Overs = JSON.parse(sessionStorage.getItem("team2Overs"));

    if (team1Runs.length === 0 || team2Runs.length === 0)
        return;

    for (let i = 0; i < team1Runs.length - 1; i++) {
        addMatchRow(1);
    }

    for (let i = 0; i < team2Runs.length - 1; i++) {
        addMatchRow(2);
    }

    document.querySelectorAll("#each-row-team-1 input[id='runs']").forEach((ele, i) => ele.value = team1Runs[i]);
    document.querySelectorAll("#each-row-team-1 input[id='overs']").forEach((ele, i) => ele.value = team1Overs[i]);

    document.querySelectorAll("#each-row-team-2 input[id='runs']").forEach((ele, i) => ele.value = team2Runs[i]);
    document.querySelectorAll("#each-row-team-2 input[id='overs']").forEach((ele, i) => ele.value = team2Overs[i]);

}
function addForBoth() {
    addMatchRow(1);
    addMatchRow(2);
}

function deleteForBoth() {

    if (Array.from(document.querySelectorAll("#each-row-team-1 input")).length > 2) {
        ele = Array.from(document.querySelectorAll("#each-row-team-1 input")).pop()
        removeMatchRow(ele.parentElement);
    }

    if (Array.from(document.querySelectorAll("#each-row-team-2 input")).length > 2) {
        ele = Array.from(document.querySelectorAll("#each-row-team-2 input")).pop()
        removeMatchRow(ele.parentElement);
    }
}

function addMatchRow(teamNo) {
    let div = document.createElement("div");
    div.className = "each-row";
    div.id = `each-row-team-${teamNo}`;

    let oversValue = 0;
    document.querySelectorAll("#overs-select input").forEach((ele) => {
        if (ele.checked)
            oversValue = ele.value;
    });


    div.innerHTML = `<label for="runs">Runs:</label>
                    <input type="number" name="runs" id="runs" value="0" required class="team-${teamNo}-runs" min="0">

                    <label for="overs">Overs:</label>
                    <input type="number" name="overs" id="overs" value="${oversValue}" step="0.1" required class="team-${teamNo}-overs" min="0">
                    <button onclick=removeMatchRow(this.parentElement) id='delete'>X</button>`;
    if (teamNo === 1)
        team1div.appendChild(div);
    else if (teamNo === 2)
        team2div.appendChild(div);

    inputEventListen();
}
function removeMatchRow(ele = null) {
    ele.remove();
}

function inputEventListen() {
    let notWantIds = ["RNRR", "target", "max-overs"];

    Array.from(document.getElementsByTagName("input")).forEach(element => {

        if (notWantIds.includes(element.id)) {
            return;
        }

        element.addEventListener("focusin", () => {
            if (element.value == 0)
                element.value = "";
        });

        element.addEventListener("focusout", () => {
            if (element.value == "")
                element.value = 0;
        });

        element.addEventListener("change", () => {
            calculate2();
            output.innerText = "NRR(Net Run Rate)\n Approx:";
            output.style.background = null;
        })
    });
}

function checkNegetiveNumbersInArrays() {
    let arrays = [team1Runs, team1Overs, team2Runs, team2Overs];

    let index = 0;
    for (let array of arrays) {
        let flag = 0
        array.forEach((ele) => {
            if (Number.parseFloat(ele) < 0 || ele.includes("-")) {
                output.innerHTML = "Wrong Input Number Format."
                flag = 1;
            }
        })

        if (flag !== 0) {
            alert("wrong Input Format.");
            continue;
        }

        if (index === 0)
            sessionStorage.setItem("team1Runs", JSON.stringify(array));
        else if (index === 1)
            sessionStorage.setItem("team1Overs", JSON.stringify(array));
        else if (index === 2)
            sessionStorage.setItem("team2Runs", JSON.stringify(array));
        else if (index === 3)
            sessionStorage.setItem("team2Overs", JSON.stringify(array));

        index++;
    }

}
function calculate2() {
    team1Runs = [];
    team1Overs = [];

    team2Runs = [];
    team2Overs = [];

    team1div.querySelectorAll("input[id='runs']").forEach((ele) => team1Runs.push(ele.value));
    team1div.querySelectorAll("input[id='overs']").forEach((ele) => team1Overs.push(ele.value));

    team2div.querySelectorAll("input[id='runs']").forEach((ele) => team2Runs.push(ele.value));
    team2div.querySelectorAll("input[id='overs']").forEach((ele) => team2Overs.push(ele.value));

    checkNegetiveNumbersInArrays();
}

function calculate() {

    calculate2();

    if (team1Runs.length !== team2Runs.length) {
        output.innerText = "Both should be same length"
        output.style.background = "rgba(205, 0, 0,0.5)";
        output.style.color = "white";
    }

    else if (!output.innerHTML.toLowerCase().includes("wrong")) {
        team1Runs = team1Runs.map((ele) => Number.parseFloat(ele));
        team1Overs = team1Overs.map((ele) => Number.parseFloat(ele));

        team2Runs = team2Runs.map((ele) => Number.parseFloat(ele));
        team2Overs = team2Overs.map((ele) => Number.parseFloat(ele));

        [team1OverallRuns, team1OverallOvers] = getTheCumRunsOvers(team1Runs, team1Overs);
        [team2OverallRuns, team2OverallOvers] = getTheCumRunsOvers(team2Runs, team2Overs);


        team1Avg = team1OverallRuns / team1OverallOvers;
        team2Avg = team2OverallRuns / team2OverallOvers;


        let nrr = Number.parseFloat((team1Avg - team2Avg).toFixed(3));

        if (nrr > 0) {
            output.style.background = "rgba(20,255,20,0.8)";
        }
        else if (nrr < 0 || Number.isNaN(nrr)) {
            output.style.background = "rgba(216, 29, 29,0.8)";
        }
        else if (nrr === 0) {
            output.style.background = "grey";
        }

        output.style.color = "white";
        output.innerText = "NRR(Net Run Rate)\n Approx: " + nrr;
    }

}

function getTheCumRunsOvers(teamRuns, teamOvers) {
    let runs = 0;
    let overs = 0;

    for (let i = 0; i < teamRuns.length; i++) {
        let run = teamRuns[i];
        let over = teamOvers[i];

        if (!Number.isInteger(over)) {
            let balls = over * 10 - Math.trunc(over) * 10;
            over = Math.trunc(over) + balls * (1 / 6);
        }

        runs += run;
        overs += over;

    }

    return [runs, overs];
}

function reset() {
    document.querySelectorAll("#each-row-team-1 input[id='runs']").forEach((ele, i) => ele.value = "0");
    document.querySelectorAll("#each-row-team-1 input[id='overs']").forEach((ele, i) => ele.value = "0");

    document.querySelectorAll("#each-row-team-2 input[id='runs']").forEach((ele, i) => ele.value = "0");
    document.querySelectorAll("#each-row-team-2 input[id='overs']").forEach((ele, i) => ele.value = "0");

    document.getElementById("output").innerHTML = "NRR(Net Run Rate)<br> Approx:";
    document.getElementById("output").style.background = null;
}



inputEventListen();