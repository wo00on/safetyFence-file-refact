
import Global from '@/constants/Global';
import { User } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
    name: string;
}

const MyPageHeader: React.FC<Props> = ({ name }) => {
    return (
        <View className="bg-green-500 px-6 pt-8 pb-10 rounded-b-[40px] shadow-sm mb-6">
            <View className="flex-row items-center justify-center mb-6">
                <Text className="text-2xl font-bold text-white">마이페이지</Text>
            </View>

            <View className="flex-row items-center bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
                <View className="w-16 h-16 rounded-full bg-white items-center justify-center mr-4">
                    <User size={32} color="#22c55e" />
                </View>
                <View>
                    <View className="flex-row items-center mb-1">
                        <Text className="text-2xl font-bold text-white mr-2">{name}</Text>
                        <View className="bg-white/20 px-2 py-0.5 rounded-full">
                            <Text className="text-xs text-white font-medium">
                                {Global.USER_ROLE === 'supporter' ? '보호자' : '이용자'}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-green-100 text-sm">
                        {Global.USER_ROLE === 'supporter' ? '이용자를 안전하게 보호하고 있습니다' : '안전한 하루 되세요!'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default MyPageHeader;
