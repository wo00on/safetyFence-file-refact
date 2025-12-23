
import Global from '@/constants/Global';
import { MapPin, User } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
    data: {
        birth: string;
        homeAddress: string;
        centerAddress?: string;
        linkCode?: string;
    };
}

const ProfileItem: React.FC<{ label: string; value: string | React.ReactNode; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <View className="flex-row items-center py-2">
        <View className="w-8 items-center justify-center">
            {icon}
        </View>
        <View className="ml-3 flex-1">
            <Text className="text-xs font-medium text-gray-500 mb-0.5">{label}</Text>
            {typeof value === 'string' ? (
                <Text className="text-base font-semibold text-gray-800">{value}</Text>
            ) : (
                value
            )}
        </View>
    </View>
);

const ProfileCard: React.FC<Props> = ({ data }) => {
    return (
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-5">
            <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 rounded-full bg-green-50 items-center justify-center mr-2">
                    <User size={16} color="#16a34a" />
                </View>
                <Text className="text-lg font-bold text-gray-900">기본 정보</Text>
            </View>

            <View className="space-y-4">
                <ProfileItem label="생년월일" value={data.birth} icon={<Text className="text-lg">🎂</Text>} />
                <ProfileItem label="우편번호" value={data.homeAddress} icon={<MapPin size={18} color="#9ca3af" />} />
                {Global.USER_ROLE === 'user' && (
                    <>
                        <ProfileItem label="센터 우편번호" value={data.centerAddress || '-'} icon={<Text className="text-lg">🏥</Text>} />
                        <ProfileItem label="링크 코드" value={data.linkCode || '-'} icon={<Text className="text-lg">🔗</Text>} />
                    </>
                )}
            </View>
        </View>
    );
};

export default ProfileCard;
