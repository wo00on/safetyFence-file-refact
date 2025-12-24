import { WeatherData, weatherService } from '@/services/weatherService';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Umbrella } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface WeatherWidgetProps {
    location: { latitude: number; longitude: number } | null;
}

export default function WeatherWidget({ location }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            // 위치 정보가 없으면 기본값(서울) 사용
            const lat = location?.latitude || 37.5665;
            const lon = location?.longitude || 126.9780;

            const data = await weatherService.getWeather(lat, lon);
            setWeather(data);
            setLoading(false);
        };

        fetchWeather();
    }, [location]);

    if (loading) {
        return (
            <View className="h-40 bg-blue-50 rounded-3xl items-center justify-center mb-6">
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text className="text-gray-400 text-sm mt-2">날씨 정보를 불러오고 있어요...</Text>
            </View>
        );
    }

    // 날씨 코드에 따른 아이콘 렌더링
    const renderWeatherIcon = (code: number) => {
        const iconSize = 48;
        const iconColor = "#fbbf24"; // amber-400 (Sun)

        if (code === 0) return <Sun size={iconSize} color={iconColor} />;
        if (code >= 1 && code <= 3) return <Cloud size={iconSize} color="#94a3b8" />;
        if (code >= 45 && code <= 48) return <CloudFog size={iconSize} color="#94a3b8" />;
        if (code >= 51 && code <= 67) return <Umbrella size={iconSize} color="#60a5fa" />;
        if (code >= 80 && code <= 82) return <CloudRain size={iconSize} color="#60a5fa" />;
        if (code >= 71 && code <= 77) return <CloudSnow size={iconSize} color="#bfdbfe" />;
        if (code >= 95 && code <= 99) return <CloudLightning size={iconSize} color="#6366f1" />;

        return <Cloud size={iconSize} color="#94a3b8" />;
    };

    return (
        <View className="bg-blue-50 rounded-3xl p-6 mb-6 shadow-sm border border-blue-100">
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    {weather && renderWeatherIcon(weather.weatherCode)}
                    <View className="ml-4">
                        <Text className="text-3xl font-bold text-gray-800">
                            {weather?.temperature}°C
                        </Text>
                        <Text className="text-lg text-gray-600 font-medium">
                            {weather?.description}
                        </Text>
                    </View>
                </View>
                <View className="bg-white px-3 py-1 rounded-full">
                    <Text className="text-blue-600 text-xs font-bold">오늘의 건강</Text>
                </View>
            </View>

            <View className="bg-white p-4 rounded-2xl">
                <Text className="text-gray-700 text-base leading-6 font-medium">
                    "{weather?.advice}"
                </Text>
            </View>
        </View>
    );
}
