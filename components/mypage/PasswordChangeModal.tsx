
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const PasswordChangeModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center p-6">
                <View className="bg-white rounded-3xl p-6">
                    <Text className="text-xl font-bold mb-6 text-center">비밀번호 변경</Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-sm font-bold text-gray-600 mb-2 ml-1">현재 비밀번호</Text>
                            <TextInput
                                value={passwordData.currentPassword}
                                onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                                secureTextEntry
                                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5"
                                placeholder="현재 비밀번호를 입력하세요"
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-gray-600 mb-2 ml-1">새 비밀번호</Text>
                            <TextInput
                                value={passwordData.newPassword}
                                onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                                secureTextEntry
                                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5"
                                placeholder="새 비밀번호를 입력하세요"
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-bold text-gray-600 mb-2 ml-1">새 비밀번호 확인</Text>
                            <TextInput
                                value={passwordData.confirmPassword}
                                onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                                secureTextEntry
                                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5"
                                placeholder="새 비밀번호를 다시 입력하세요"
                            />
                        </View>

                        <View className="flex-row space-x-3 mt-4">
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
                            >
                                <Text className="text-gray-600 font-bold">취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onSubmit(passwordData)}
                                className="flex-1 bg-green-500 py-4 rounded-2xl items-center"
                            >
                                <Text className="text-white font-bold">변경하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PasswordChangeModal;
