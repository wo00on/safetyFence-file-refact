
import { storage } from '@/utils/storage';
import { Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface MedicineManagerProps {
    visible: boolean;
    onClose: () => void;
    medicineList: string[];
    onUpdateList: (newList: string[]) => void;
}

export default function MedicineManager({ visible, onClose, medicineList, onUpdateList }: MedicineManagerProps) {
    const [newMedicineName, setNewMedicineName] = useState('');

    const handleAddMedicine = async () => {
        if (!newMedicineName.trim()) {
            Alert.alert('알림', '약 이름을 입력해주세요.');
            return;
        }

        if (medicineList.includes(newMedicineName.trim())) {
            Alert.alert('알림', '이미 등록된 약입니다.');
            return;
        }

        const newList = [...medicineList, newMedicineName.trim()];
        await storage.setMedicineList(newList);
        onUpdateList(newList);
        setNewMedicineName('');
    };

    const handleDeleteMedicine = async (nameToDelete: string) => {
        Alert.alert('삭제 확인', `'${nameToDelete}'을(를) 정말 삭제하시겠습니까?`, [
            { text: '취소', style: 'cancel' },
            {
                text: '삭제',
                style: 'destructive',
                onPress: async () => {
                    const newList = medicineList.filter(name => name !== nameToDelete);
                    await storage.setMedicineList(newList);
                    onUpdateList(newList);
                }
            }
        ]);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-[30px] h-[80%] p-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-2xl font-bold text-gray-900">약 목록 관리</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row mb-6">
                        <TextInput
                            className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-lg mr-3"
                            placeholder="예: 혈압약, 당뇨약"
                            value={newMedicineName}
                            onChangeText={setNewMedicineName}
                            returnKeyType="done"
                            onSubmitEditing={handleAddMedicine}
                        />
                        <TouchableOpacity
                            onPress={handleAddMedicine}
                            className="bg-blue-500 w-14 items-center justify-center rounded-xl"
                        >
                            <Plus size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-lg font-bold text-gray-700 mb-3">등록된 약 ({medicineList.length})</Text>

                    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                        {medicineList.length === 0 ? (
                            <View className="items-center justify-center py-20">
                                <Text className="text-gray-400 text-lg">등록된 약이 없습니다.</Text>
                                <Text className="text-gray-400 text-base mt-2">위 입력창에서 약을 추가해보세요.</Text>
                            </View>
                        ) : (
                            medicineList.map((medicine, index) => (
                                <View key={index} className="flex-row items-center justify-between bg-white border border-gray-200 p-4 rounded-xl mb-3 shadow-sm">
                                    <Text className="text-xl font-medium text-gray-800">{medicine}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteMedicine(medicine)}
                                        className="p-2 bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={20} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
