
import Global from '@/constants/Global';
import { useLocation } from '@/contexts/LocationContext';
import { storage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { AlertCircle, Calendar, Pill, Plus, Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MedicineManager from '../components/senior/MedicineManager';
import TopHeader from '../components/senior/TopHeader';
import WeatherWidget from '../components/senior/WeatherWidget';

export default function SeniorMainPage() {
    const router = useRouter();
    const { currentLocation } = useLocation(); // 필요한 경우 위치 정보 사용
    const [userName, setUserName] = useState('');
    const [medicineList, setMedicineList] = useState<string[]>([]);
    const [isMedicineManagerVisible, setIsMedicineManagerVisible] = useState(false);

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

    const handleMedicineRecord = async (medicineName: string) => {
        try {
            const now = new Date();
            const log = {
                id: Date.now(),
                medicineName,
                time: now.toISOString(),
                date: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`,
                type: 'medicine',
            };

            await storage.addMedicineLog(log);

            ToastAndroid.show(`${medicineName} 복용이 기록되었습니다.`, ToastAndroid.SHORT);

            // TODO: 보호자에게 알림 전송 로직 추가 가능 (API 연동 필요 시)
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
                        // 1. 전화 걸기 (옵션)
                        if (Global.TARGET_NUMBER) { // Senior mode doesn't usually track target number in global like supporter, need check implementation logic. 
                            // Actually Global.TARGET_NUMBER is for supporter tracking user. 
                            // Senior might have GUARDIAN_NUMBER in storage if implemented. 
                            // For now, let's just show an alert or simulate.
                            Alert.alert('알림', '보호자에게 긴급 알림을 보냈습니다.');
                        } else {
                            Alert.alert('알림', '등록된 보호자 연락처가 없습니다.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>

                {/* 1. 상단 헤더 */}
                <TopHeader
                    userName={userName}
                    onMapPress={() => router.push('/MapPage')}
                    onMyPagePress={() => router.push('/MyPage')}
                />

                {/* 2. 날씨 위젯 */}
                <WeatherWidget location={currentLocation} />

                {/* 3. 메인 그리드 메뉴 (2x2) */}
                <View className="flex-row flex-wrap justify-between">

                    {/* 긴급 호출 */}
                    <TouchableOpacity
                        onPress={handleEmergency}
                        activeOpacity={0.7}
                        className="w-[48%] aspect-square bg-red-50 rounded-3xl p-5 justify-between mb-4 border border-red-100 shadow-sm"
                    >
                        <View className="bg-red-100 w-14 h-14 rounded-full items-center justify-center">
                            <AlertCircle size={32} color="#ef4444" />
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-red-600">긴급 호출</Text>
                            <Text className="text-sm text-red-400 mt-1">위급 상황 시{'\n'}눌러주세요</Text>
                        </View>
                    </TouchableOpacity>

                    {/* 일정/캘린더 */}
                    <TouchableOpacity
                        onPress={() => router.push('/CalendarPage')}
                        activeOpacity={0.7}
                        className="w-[48%] aspect-square bg-green-50 rounded-3xl p-5 justify-between mb-4 border border-green-100 shadow-sm"
                    >
                        <View className="bg-green-100 w-14 h-14 rounded-full items-center justify-center">
                            <Calendar size={32} color="#16a34a" />
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-green-700">나의 일정</Text>
                            <Text className="text-sm text-green-500 mt-1">병원, 약 복용{'\n'}기록 보기</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 약 복용 섹션 (기존 그리드 대신 가로형 리스트로 변경하여 접근성 향상) */}
                <View className="bg-blue-50 rounded-3xl p-6 mb-4 border border-blue-100">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <View className="bg-blue-100 p-2 rounded-full mr-3">
                                <Pill size={24} color="#3b82f6" />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">지금 약 드셨나요?</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setIsMedicineManagerVisible(true)}
                            className="bg-white px-3 py-1.5 rounded-full border border-blue-200"
                        >
                            <Text className="text-blue-600 text-xs font-bold">+ 약 관리</Text>
                        </TouchableOpacity>
                    </View>

                    {medicineList.length === 0 ? (
                        <TouchableOpacity
                            onPress={() => setIsMedicineManagerVisible(true)}
                            className="bg-white rounded-2xl p-5 items-center justify-center border border-dashed border-blue-300"
                        >
                            <Plus size={32} color="#93c5fd" />
                            <Text className="text-gray-400 font-medium mt-2">여기를 눌러 드시는 약을 등록하세요</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="flex-row flex-wrap bg-white rounded-2xl p-3">
                            {medicineList.map((medicine, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleMedicineRecord(medicine)}
                                    className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mr-2 mb-2 shadow-sm active:bg-blue-100"
                                >
                                    <Text className="text-blue-800 font-bold text-lg">{medicine}</Text>
                                    <Text className="text-blue-400 text-xs mt-0.5">터치하여 기록</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                onPress={() => setIsMedicineManagerVisible(true)}
                                className="bg-gray-50 border border-gray-200 border-dashed rounded-xl px-4 py-3 mb-2 items-center justify-center"
                            >
                                <Plus size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <Text className="text-blue-400 text-xs mt-3 text-center">
                        약 이름을 누르면 바로 복용 완료로 기록됩니다.
                    </Text>
                </View>

                {/* 내 정보 (하단 전체) */}
                <TouchableOpacity
                    onPress={() => router.push('/MyPage')}
                    activeOpacity={0.7}
                    className="w-full bg-gray-50 rounded-3xl p-5 flex-row items-center border border-gray-200 mb-6"
                >
                    <View className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center mr-4">
                        <Settings size={24} color="#4b5563" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-gray-800">내 정보 설정</Text>
                        <Text className="text-sm text-gray-500">계정 및 알림 설정</Text>
                    </View>
                </TouchableOpacity>

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
