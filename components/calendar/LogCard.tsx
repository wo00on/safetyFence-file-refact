
import { Clock, MapPin } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { Log } from '../../types/calendar';

interface Props {
    log: Log;
}

const LogCard: React.FC<Props> = React.memo(({ log }) => (
    <View className="bg-white rounded-xl shadow p-4 mb-3 border border-gray-100">
        <View className="flex-row items-start">
            <View className="h-11 w-11 bg-blue-50 rounded-lg items-center justify-center mr-3">
                <MapPin size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 mb-1">{log.location}</Text>
                <View className="flex-row items-center mb-2">
                    <Clock size={13} color="#6b7280" />
                    <Text className="text-sm text-gray-600 ml-1.5">
                        {log.arriveTime}
                    </Text>
                </View>
                <Text className="text-sm text-gray-500 mb-3">{log.address}</Text>
                <View className="self-start px-2.5 py-1 rounded-full bg-blue-100">
                    <Text className="text-xs font-semibold text-blue-700">
                        과거 로그
                    </Text>
                </View>
            </View>
        </View>
    </View>
));

export default LogCard;
//