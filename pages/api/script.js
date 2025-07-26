async function analyze() {
  const jobText = document.getElementById("jobText").value;
  document.getElementById("result").textContent = "Analyzing...";
  const res = await fetch("/api/analyze-job", {
    method: "POST", headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ jobText })
  });
  const json = await res.json();
  document.getElementById("result").textContent = json.analysis;
}
