
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    headerText: string;
    headerSubText: string;
    onBack?: () => void;
}

const MapHeader: React.FC<Props> = ({ headerText, headerSubText, onBack }) => {
    return (
        <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }} edges={['top']}>
            <View className="p-3">
                <View
                    className="border border-green-400 rounded-xl p-3 bg-white/90 shadow-md"
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    {onBack && (
                        <TouchableOpacity onPress={onBack} style={{ position: 'absolute', left: 12, zIndex: 10 }}>
                            <Ionicons name="arrow-back" size={24} color="#166534" />
                        </TouchableOpacity>
                    )}

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'System' }} className="text-lg font-bold text-green-800 text-center">
                            {headerText}
                        </Text>
                        <Text style={{ fontFamily: 'System' }} className="text-sm text-green-600 text-center mt-1">
                            {headerSubText}
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default MapHeader;
