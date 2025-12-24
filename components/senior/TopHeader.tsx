import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TopHeaderProps {
    userName: string;
    onMapPress: () => void;
    onMyPagePress: () => void;
}

export default function TopHeader({ userName, onMapPress, onMyPagePress }: TopHeaderProps) {
    return (
        <View className="flex-row items-center justify-between mb-6 px-2">
            <View>
                <View className="flex-row items-center mb-1">
                    <Text className="text-2xl font-bold text-gray-800 mr-2">
                        {userName}님,
                    </Text>
                    <TouchableOpacity
                        onPress={onMyPagePress}
                        className="bg-gray-100 px-3 py-1.5 rounded-full flex-row items-center"
                    >
                        <Ionicons name="settings-sharp" size={16} color="#6b7280" />
                        <Text className="text-xs text-gray-600 font-bold ml-1">내 정보</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-lg text-gray-600">
                    오늘도 건강한 하루 되세요!
                </Text>
            </View>

            <TouchableOpacity
                onPress={onMapPress}
                className="bg-[#FEF3C7] p-3 rounded-2xl items-center justify-center active:bg-[#FDE68A]"
            >
                <Ionicons name="map" size={28} color="#92400E" />
                <Text className="text-xs text-[#92400E] font-bold mt-1">지도 보기</Text>
            </TouchableOpacity>
        </View>
    );
}
