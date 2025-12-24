import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface WeatherWidgetProps {
    location: { latitude: number; longitude: number } | null;
}

interface WeatherData {
    temperature: number;
    weatherCode: number;
    description: string;
    advice: string;
}

export default function NewWeatherWidget({ location }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 테스트를 위해 API 호출 대신 하드코딩된 데이터 사용
        setTimeout(() => {
            setWeather({
                temperature: 24,
                weatherCode: 0,
                description: '맑음',
                advice: '오늘 날씨가 참 좋아요. 산책하기 딱 좋은 날씨네요!'
            });
            setLoading(false);
        }, 500);
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
        // 아이콘 라이브러리 충돌 테스트: 텍스트로 대체
        return <Text className="text-2xl">☀️</Text>;
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
