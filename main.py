
from pyscript import *
from pyscript import document
from js import alert
import sympy
import math

output_ele = document.getElementById("output")
required_run_rate_ele = document.getElementById("RNRR")
target_ele = document.getElementById("target")
max_overs_ele = document.getElementById("max-overs")

def on_click(event):

    req_run_rate = required_run_rate_ele.value
    if req_run_rate.endswith("."):
            req_run_rate += "0"

    target = -1
    if not target_ele.disabled:
        target = target_ele.value
        if target.endswith("."):
            target += "0"
        
    
    max_overs = max_overs_ele.value
    text_if_target_empty = ""

    if (target != -1 and target == ""):
        text_if_target_empty = "Target not Empty else uncheck\n"
    
    if (req_run_rate == "" or max_overs == "" or (target != -1 and target == "")):
        
        output_ele.innerText = text_if_target_empty + "Enter All the required data"
        output_ele.style.background = "rgba(205, 0, 0,0.5)"
        output_ele.style.color = "white"
        return
        
    
    req_run_rate, target = float(req_run_rate), float(target)
    max_overs = float(max_overs)

    team1div = document.getElementById("runs-overs-inputs-team-1")
    team2div = document.getElementById("runs-overs-inputs-team-2")

    team1_runs_ele  = team1div.querySelectorAll("input[id='runs']")
    team1_overs_ele = team1div.querySelectorAll("input[id='overs']")

    team2_runs_ele  = team2div.querySelectorAll("input[id='runs']")
    team2_overs_ele = team2div.querySelectorAll("input[id='overs']")

    team1_runs = get_each(team1_runs_ele)
    team1_overs = get_each(team1_overs_ele)

    team2_runs = get_each(team2_runs_ele)
    team2_overs = get_each(team2_overs_ele)

    if len(team1_runs) != len(team2_runs):
        alert("Both should be same length")
        output_ele.innerText = "Both should be same length"
        output_ele.style.background = "rgba(205, 0, 0,0.5)"
        output_ele.style.color = "white"
        return
    
    team1_cumulative_runs = sum(team1_runs)
    team1_cumulative_overs = sum(team1_overs)

    team2_cumulative_runs = sum(team2_runs)
    team2_cumulative_overs = sum(team2_overs)

    if target != -1:
        
        x = sympy.symbols("x")

        lhs = (team1_cumulative_runs + target) / (team1_cumulative_overs + x) - (team2_cumulative_runs + target - 1) / (team2_cumulative_overs + max_overs)
        rhs = req_run_rate

        eq = sympy.Eq(lhs,rhs)

        final_overs = sympy.solve(eq)[0]
        truncated = math.trunc(final_overs)
        final_overs_adj = (final_overs - truncated) * 0.6 + truncated

        output_ele.innerText = f"Team should be complete match with in \nApprox:{round(final_overs_adj,1)} overs"
        output_ele.style.background = "rgba(20,255,20,0.5)"
        output_ele.style.color = "white"
    
    else:

        x = sympy.symbols("x")
        y = sympy.symbols("y")

        lhs = (team1_cumulative_runs + x) / (team1_cumulative_overs + max_overs) - (team2_cumulative_runs + y) / (team2_cumulative_overs + max_overs)
        rhs = req_run_rate

        eq = sympy.Eq(lhs,rhs)

        simplified_eq = sympy.simplify(eq)

        final_ans = sympy.solve(simplified_eq.subs(y,-1))[0]

        output_ele.innerText = f"Team Need to win with\n Approx: {round(final_ans)} Runs\n To get run rate of {req_run_rate}"
        output_ele.style.background = "rgba(20,255,20,0.5)"
        output_ele.style.color = "white"



def get_each(arr):
    l = []
    for i in arr:
        l.append(float(i.value))

    return l
