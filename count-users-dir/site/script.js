const url = "/count";
const h1 = document.getElementById("visitor-count");

fetch(url)
  .then(res => res.arrayBuffer())
  .then(buf => {
    const count = new DataView(buf).getBigUint64(0);
    h1.textContent = `You are visitor number ${count}`;
  })
  .catch(err => {
    console.error("Error fetching visitor count:", err);
    h1.textContent = "Could not load visitor count.";
  });
