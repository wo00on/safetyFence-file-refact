
import { MedicineLog } from '@/types/calendar';
import { Pill } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface MedicineCardProps {
    log: MedicineLog;
}

export default function MedicineCard({ log }: MedicineCardProps) {
    const timeString = `${log.time.getHours().toString().padStart(2, '0')}:${log.time.getMinutes().toString().padStart(2, '0')}`;

    return (
        <View className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm border-l-4 border-blue-500">
            <View className="h-10 w-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Pill size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-base font-bold text-gray-900">{log.medicineName}</Text>
                    <Text className="text-sm font-medium text-blue-600">{timeString}</Text>
                </View>
                <Text className="text-sm text-gray-500">복용 완료</Text>
            </View>
        </View>
    );
}
