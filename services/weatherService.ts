
export interface WeatherData {
    temperature: number;
    weatherCode: number;
    description: string;
    advice: string;
}

export const weatherService = {
    async getWeather(lat: number, lon: number): Promise<WeatherData | null> {
        try {
            // Open-Meteo API (무료, 인증키 불필요)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            const data = await response.json();

            if (!data.current_weather) return null;

            const code = data.current_weather.weathercode;
            const temp = data.current_weather.temperature;

            return {
                temperature: temp,
                weatherCode: code,
                description: getWeatherDescription(code),
                advice: getHealthAdvice(code, temp),
            };
        } catch (error) {
            console.error('날씨 데이터 조회 실패:', error);
            return null;
        }
    }
};

function getWeatherDescription(code: number): string {
    if (code === 0) return '맑음';
    if (code >= 1 && code <= 3) return '구름 조금';
    if (code >= 45 && code <= 48) return '안개';
    if (code >= 51 && code <= 67) return '비';
    if (code >= 71 && code <= 77) return '눈';
    if (code >= 80 && code <= 82) return '소나기';
    if (code >= 95 && code <= 99) return '천둥번개';
    return '흐림';
}

function getHealthAdvice(code: number, temp: number): string {
    if (temp <= 5) return '날씨가 많이 추워요. 따뜻하게 입고 외출하세요!';
    if (temp >= 30) return '폭염 주의! 야외 활동을 자제하고 물을 자주 드세요.';

    if (code >= 51 && code <= 67) return '비가 오네요. 우산을 꼭 챙기세요. 미끄럼 주의하세요!';
    if (code >= 71 && code <= 77) return '눈이 와요. 길이 미끄러우니 조심하세요!';
    if (code >= 45 && code <= 48) return '안개가 꼈어요. 앞이 잘 안보이니 천천히 이동하세요.';

    // 미세먼지 데이터는 별도 API가 필요하므로 일단 기온/날씨 기반 조언
    return '오늘도 건강하고 활기찬 하루 보내세요!';
}
