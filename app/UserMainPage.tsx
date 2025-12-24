import { useLocation } from '@/contexts/LocationContext';
import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MedicineManager from '../components/senior/MedicineManager';
import TopHeader from '../components/senior/TopHeader';

export default function UserMainPage() {
    const router = useRouter();
    const { isWebSocketConnected } = useLocation();
    const [userName, setUserName] = useState('');
    const [medicineList, setMedicineList] = useState<string[]>([]);
    const [isMedicineManagerVisible, setIsMedicineManagerVisible] = useState(false);
    const [takenMedicines, setTakenMedicines] = useState<string[]>([]);

    useEffect(() => {
        loadUserData();
        loadMedicineList();
    }, []);

    const loadUserData = async () => {
        const name = await storage.getUserName();
        if (name) setUserName(name);
    };

    const loadMedicineList = async () => {
        const list = await storage.getMedicineList();
        setMedicineList(list);
    };

    const handleUpdateMedicineList = (newList: string[]) => {
        setMedicineList(newList);
    };

    const handleMedicineRecord = async (medicineName: string, timeSlot?: string) => {
        try {
            const now = new Date();
            const logName = timeSlot ? `${medicineName} (${timeSlot})` : medicineName;

            const log = {
                id: Date.now(),
                medicineName: logName,
                time: now.toISOString(),
                date: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`,
                type: 'medicine',
            };

            await storage.addMedicineLog(log);

            // UI 상태 업데이트
            if (timeSlot) {
                const key = `${medicineName}-${timeSlot}`;
                setTakenMedicines(prev => [...prev, key]);
            } else {
                setTakenMedicines(prev => [...prev, medicineName]); // Legacy fallback
            }

            ToastAndroid.show(`${logName} 복용이 기록되었습니다.`, ToastAndroid.SHORT);
        } catch (error) {
            console.error('약 복용 기록 실패:', error);
            Alert.alert('오류', '기록에 실패했습니다.');
        }
    };

    const handleEmergency = () => {
        Alert.alert(
            '긴급 호출',
            '보호자에게 긴급 알림을 보내시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '호출하기',
                    style: 'destructive',
                    onPress: async () => {
                        Alert.alert('알림', '보호자에게 긴급 알림을 보냈습니다.');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 50 }}>

                {/* 1. 상단 헤더 */}
                <View className="mb-1">
                    <TopHeader
                        userName={userName}
                        onMapPress={() => router.push('/MapPage')}
                        onMyPagePress={() => router.push('/MyPage')}
                    />
                </View>

                {/* 2. 안심 연결 위젯 (중앙 정렬) */}
                <View
                    className="mb-6 flex-row items-center px-12"
                >
                    <View className={`w-14 h-14 rounded-full items-center justify-center mr-3 ${isWebSocketConnected ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                        <Ionicons
                            name={isWebSocketConnected ? "shield-checkmark" : "shield-outline"}
                            size={28}
                            color={isWebSocketConnected ? "#16a34a" : "#9ca3af"}
                        />
                    </View>
                    <View>
                        <Text className={`text-lg font-bold ${isWebSocketConnected ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                            {isWebSocketConnected ? '보호자와 연결되어 있습니다' : '연결 확인이 필요합니다'}
                        </Text>
                        <Text className="text-gray-500 text-sm mt-0.5 font-medium">
                            {isWebSocketConnected ? '오늘도 건강하고 행복한 하루 되세요' : '인터넷 연결을 확인해주세요'}
                        </Text>
                    </View>
                </View>

                {/* 3. 메인 메뉴 그리드 */}
                <View className="flex-row justify-between mb-6">
                    {/* 긴급 호출 */}
                    <TouchableOpacity
                        onPress={handleEmergency}
                        activeOpacity={0.8}
                        className="w-[48%] aspect-[0.8] bg-white rounded-2xl justify-center items-center border-2 border-red-50 shadow-sm"
                        style={{ elevation: 2 }}
                    >
                        <View className="bg-red-50 w-20 h-20 rounded-full items-center justify-center mb-3">
                            <Ionicons name="alert" size={42} color="#ef4444" />
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-extrabold text-gray-900 mb-1">긴급 호출</Text>
                            <Text className="text-base text-red-500 font-bold">위급시 누르세요</Text>
                        </View>
                    </TouchableOpacity>

                    {/* 일정 */}
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/CalendarPage', params: { initialTab: 'schedule' } })}
                        activeOpacity={0.8}
                        className="w-[48%] aspect-[0.8] bg-white rounded-2xl justify-center items-center border-2 border-green-50 shadow-sm"
                        style={{ elevation: 2 }}
                    >
                        <View className="bg-green-50 w-20 h-20 rounded-full items-center justify-center mb-3">
                            <Ionicons name="calendar" size={42} color="#16a34a" />
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-extrabold text-gray-900 mb-1">일정</Text>
                            <Text className="text-base text-green-600 font-bold">병원/약속 확인</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 4. 약 복용 섹션 */}
                <View className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100 shadow-sm">
                    <View className="flex-row items-center justify-between mb-5">
                        <View className="flex-row items-center">
                            <View className="bg-blue-100 p-2.5 rounded-2xl mr-3">
                                <Ionicons name="medkit" size={26} color="#2563eb" />
                            </View>
                            <Text className="text-xl font-extrabold text-gray-800">약 드셨나요?</Text>
                        </View>

                        <View className="flex-row space-x-2">
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/CalendarPage', params: { initialTab: 'medicine' } })}
                                className="bg-white px-4 py-2 rounded-full border border-blue-200 shadow-sm"
                            >
                                <Text className="text-blue-600 text-sm font-bold">기록장</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setIsMedicineManagerVisible(true)}
                                className="bg-blue-600 px-4 py-2 rounded-full shadow-sm"
                            >
                                <Text className="text-white text-sm font-bold">+ 관리</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {medicineList.length === 0 ? (
                        <TouchableOpacity
                            onPress={() => setIsMedicineManagerVisible(true)}
                            className="bg-white/80 rounded-2xl p-6 items-center justify-center border-2 border-dashed border-blue-200"
                        >
                            <Ionicons name="add-circle" size={40} color="#93c5fd" />
                            <Text className="text-gray-500 font-bold text-lg mt-2">이곳을 눌러 약을 등록하세요</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="flex-row flex-wrap gap-3">
                            {medicineList.map((medicine, index) => {
                                const isTaken = takenMedicines.includes(medicine);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => !isTaken && handleMedicineRecord(medicine)}
                                        activeOpacity={isTaken ? 1 : 0.7}
                                        className={`w-full border rounded-3xl px-6 py-5 shadow-sm flex-row justify-between items-center ${isTaken ? 'bg-blue-100 border-blue-300' : 'bg-white border-blue-100 active:bg-blue-50'
                                            }`}
                                    >
                                        <View>
                                            <Text className={`text-2xl font-bold mb-1 ${isTaken ? 'text-blue-800' : 'text-gray-900'}`}>
                                                {medicine}
                                            </Text>
                                            <Text className={`text-base font-bold ${isTaken ? 'text-blue-600' : 'text-blue-500'}`}>
                                                {isTaken ? '복용 완료' : '눌러서 복용 확인'}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name={isTaken ? "checkbox" : "square-outline"}
                                            size={40}
                                            color={isTaken ? "#2563eb" : "#bfdbfe"}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>



            </ScrollView>

            <MedicineManager
                visible={isMedicineManagerVisible}
                onClose={() => setIsMedicineManagerVisible(false)}
                medicineList={medicineList}
                onUpdateList={handleUpdateMedicineList}
            />
        </SafeAreaView>
    );
}
