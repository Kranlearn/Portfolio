const apiKey = "27af7b9b7c1723031ef8131f27393ef7"; // Remplace par ta vraie clé
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") return;

  // Étape 1 : Obtenir les coordonnées + météo actuelle
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`)
    .then(res => {
      if (!res.ok) throw new Error("Ville introuvable");
      return res.json();
    })
    .then(data => {
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      // Affichage météo actuelle
      document.getElementById("cityName").textContent = data.name;
      document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
      document.getElementById("description").textContent = data.weather[0].description;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.getElementById("weatherResult").classList.add("visible");

      // Étape 2 : Requête forecast → on retourne la promesse
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`);
    })
    .then(res => {
      if (!res.ok) throw new Error("Erreur lors de la récupération du forecast");
      return res.json();
    })
    .then(data => {
      // Étape 3 : Traitement des données pour le graphique
      const labels = [];
      const tempMax = [];
      const tempMin = [];

      for (let i = 0; i < data.list.length; i += 8) {
        const item = data.list[i];
        const date = new Date(item.dt * 1000);
        labels.push(date.toLocaleDateString("fr-FR", { weekday: "short" }));
        tempMax.push(item.main.temp_max);
        tempMin.push(item.main.temp_min);
      }

      // Étape 4 : Affichage du graphique
      const ctx = document.getElementById("weatherChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Température max",
              data: tempMax,
              borderColor: "#0077ff",
              fill: false
            },
            {
              label: "Température min",
              data: tempMin,
              borderColor: "#ff5500",
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    })
    .catch(error => {
      console.error("Erreur API :", error);
      alert("Erreur : " + error.message);
    });
});
const weatherBlock = document.querySelector(".weather-app");
weatherBlock.classList.remove("visible");
setTimeout(() => {
  weatherBlock.classList.add("visible");
}, 50); // 50ms  pour relancer la transition

