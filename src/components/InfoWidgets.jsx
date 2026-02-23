import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CloudSun, DollarSign } from 'lucide-react';

const InfoWidgets = () => {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState({ temp: '--', description: 'carregando...' });
    const [exchangeRate, setExchangeRate] = useState(null);

    // Reusable fetch function
    const fetchRealTimeData = useCallback(() => {
        // 1. Weather API (Maputo: -25.9653, 32.589) using Open-Meteo
        fetch('https://api.open-meteo.com/v1/forecast?latitude=-25.9653&longitude=32.589&current_weather=true')
            .then(res => res.json())
            .then(data => {
                const cw = data.current_weather;
                if (cw) {
                    setWeather({
                        temp: Math.round(cw.temperature),
                        description: cw.weathercode === 0 ? 'Limpo' : (cw.weathercode < 40 ? 'Nublado' : 'Chuva')
                    });
                }
            })
            .catch(err => console.error("Error fetching weather:", err));

        // 2. Exchange Rate API (USD to MZN)
        fetch('https://open.er-api.com/v6/latest/USD')
            .then(res => res.json())
            .then(data => {
                if (data && data.rates && data.rates.MZN) {
                    setExchangeRate(data.rates.MZN);
                }
            })
            .catch(err => console.error("Error fetching exchange rate:", err));
    }, []);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Initial fetch and polling every 10 minutes
    useEffect(() => {
        fetchRealTimeData(); // Initial load

        const pollTimer = setInterval(fetchRealTimeData, 600000); // 10 minutes refresh
        return () => clearInterval(pollTimer);
    }, [fetchRealTimeData]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Digital Clock */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl shadow-lg text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium opacity-90">Hora Atual</p>
                        <p className="text-2xl font-bold tracking-wider font-mono">
                            {time.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Temperature Widget */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <CloudSun className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium opacity-90">Maputo</p>
                        <p className="text-2xl font-bold">{weather.temp}°C</p>
                        <p className="text-[10px] opacity-75 capitalize">{weather.description}</p>
                    </div>
                </div>
            </div>

            {/* Exchange Rate Widget */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium opacity-90">Câmbio USD → MZN</p>
                        <p className="text-2xl font-bold">{exchangeRate !== null ? exchangeRate.toFixed(2) : '--'} MT</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoWidgets;
