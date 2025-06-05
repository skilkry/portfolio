const loadDataButton = document.getElementById('loadData');
const citySelect = document.getElementById('city');
const weatherChartCanvas = document.getElementById('weatherChart').getContext('2d');

let weatherChart;

const fetchWeatherData = async (city) => {
    const apiKey = 'TU_API_KEY_DE_OPENWEATHER';  // Inserta tu clave de API aquí
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=5&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    return data.list.map(item => ({
        date: item.dt_txt,
        temperature: item.main.temp,
    }));
};

const updateChart = (data) => {
    const labels = data.map(item => item.date);
    const temperatures = data.map(item => item.temperature);

    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(weatherChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperatura (°C)',
                data: temperatures,
                borderColor: '#1E40AF',
                backgroundColor: 'rgba(30, 64, 175, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
};

loadDataButton.addEventListener('click', async () => {
    const city = citySelect.value;
    const weatherData = await fetchWeatherData(city);
    updateChart(weatherData);
});
