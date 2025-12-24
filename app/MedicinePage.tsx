import { useFocusEffect } from '@react-navigation/native';
import { Pill, Plus, Trash2, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import { storage } from '../utils/storage';

const MedicinePage: React.FC = () => {
    const [medicineList, setMedicineList] = useState<string[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newMedicineName, setNewMedicineName] = useState('');

    const loadMedicineList = useCallback(async () => {
        const list = await storage.getMedicineList();
        setMedicineList(list);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadMedicineList();
        }, [loadMedicineList])
    );

    const handleAddMedicine = async () => {
        if (!newMedicineName.trim()) {
            Alert.alert('알림', '약 이름을 입력해주세요.');
            return;
        }

        try {
            const currentList = await storage.getMedicineList();
            if (currentList.includes(newMedicineName.trim())) {
                Alert.alert('알림', '이미 등록된 약입니다.');
                return;
            }

            const newList = [...currentList, newMedicineName.trim()];
            await storage.setMedicineList(newList);
            setMedicineList(newList);
            setNewMedicineName('');
            setIsAddModalVisible(false);
            Alert.alert('성공', '약이 추가되었습니다.');
        } catch (error) {
            console.error('약 추가 실패:', error);
            Alert.alert('오류', '약 추가에 실패했습니다.');
        }
    };

    const handleDeleteMedicine = (medicine: string) => {
        Alert.alert('약 삭제', `'${medicine}'을(를) 정말 삭제하시겠습니까?`, [
            { text: '취소', style: 'cancel' },
            {
                text: '삭제',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const currentList = await storage.getMedicineList();
                        const newList = currentList.filter(item => item !== medicine);
                        await storage.setMedicineList(newList);
                        setMedicineList(newList);
                    } catch (error) {
                        console.error('약 삭제 실패:', error);
                        Alert.alert('오류', '삭제 실패');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }: { item: string }) => (
        <View className="flex-row items-center justify-between bg-white px-6 py-5 rounded-3xl mb-4 shadow-sm border border-green-200">
            <View className="flex-row items-center flex-1">
                <View className="bg-green-100 p-3.5 rounded-2xl mr-4">
                    <Pill size={24} color="#16a34a" fill="#dcfce7" />
                </View>
                <Text className="text-xl font-bold text-gray-800 flex-1">{item}</Text>
            </View>
            <TouchableOpacity
                onPress={() => handleDeleteMedicine(item)}
                className="p-3 bg-red-50 rounded-xl"
                activeOpacity={0.6}
            >
                <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50 pt-safe">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* 헤더 */}
            <View className="flex-row items-center justify-between px-6 py-4 bg-transparent mb-2">
                <View>
                    <Text className="text-3xl font-extrabold text-gray-900">약 관리</Text>
                    <Text className="text-gray-500 font-medium mt-1">어르신이 드시는 약을 등록하세요</Text>
                </View>
                <TouchableOpacity
                    className="bg-green-500 px-4 py-3 rounded-2xl shadow-sm active:bg-green-600 flex-row items-center"
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Plus size={20} color="white" />
                    <Text className="text-white font-bold ml-1.5 text-base">약 추가</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 px-5">
                <FlatList
                    data={medicineList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-24 px-10">
                            <View className="bg-green-50 p-8 rounded-full mb-6 relative">
                                <Pill size={64} color="#22c55e" />
                                <View className="absolute top-0 right-0 bg-yellow-400 w-6 h-6 rounded-full border-2 border-white" />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">약 목록이 비어있어요</Text>
                            <Text className="text-base text-gray-500 text-center leading-6">
                                '약 추가' 버튼을 눌러{"\n"}어르신이 드셔야 할 약을 등록해주세요.
                            </Text>
                        </View>
                    }
                />
            </View>

            {/* 약 추가 모달 */}
            <Modal
                visible={isAddModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <View className="flex-1 bg-black/60 justify-center px-6">
                    <View className="bg-white rounded-[32px] p-7 shadow-2xl">
                        <View className="flex-row justify-between items-center mb-8">
                            <View>
                                <Text className="text-2xl font-bold text-gray-900">새로운 약 등록</Text>
                                <Text className="text-gray-500 font-medium mt-1">약 이름을 입력해주세요</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsAddModalVisible(false)} className="p-2 bg-gray-100 rounded-full">
                                <X size={24} color="#4b5563" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-8">
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-5 h-16">
                                <Pill size={24} color="#6b7280" />
                                <TextInput
                                    className="flex-1 ml-4 text-xl text-gray-900 font-bold"
                                    placeholder="예: 고혈압약, 비타민"
                                    placeholderTextColor="#9ca3af"
                                    value={newMedicineName}
                                    onChangeText={setNewMedicineName}
                                    autoFocus
                                />
                            </View>
                        </View>

                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                className="flex-1 bg-gray-100 py-4.5 rounded-2xl items-center"
                                onPress={() => setIsAddModalVisible(false)}
                            >
                                <Text className="font-bold text-gray-600 text-lg">취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-green-500 py-4.5 rounded-2xl items-center shadow-md active:bg-green-600"
                                onPress={handleAddMedicine}
                            >
                                <Text className="font-bold text-white text-lg">등록하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <BottomNavigation currentScreen="MedicinePage" />
        </SafeAreaView>
    );
};

export default MedicinePage;
