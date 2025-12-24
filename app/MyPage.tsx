
import Global from '@/constants/Global';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import GeofenceList from '../components/mypage/GeofenceList';
import MyPageHeader from '../components/mypage/MyPageHeader';
import PasswordChangeModal from '../components/mypage/PasswordChangeModal';
import ProfileCard from '../components/mypage/ProfileCard';
import SettingsCard from '../components/mypage/SettingsCard';
import { useMyPageLogic } from '../hooks/useMyPageLogic';

const MyPage: React.FC = () => {
  const navigation = useNavigation();
  const {
    userData,
    loading,
    error,
    fetchUserData,
    handleLogout,
    handleGeofenceDelete,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    handlePasswordChange,
  } = useMyPageLogic();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-3 text-gray-500">사용자 정보를 불러오는 중입니다...</Text>
      </SafeAreaView>
    );
  }

  if (error && !userData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
        <Text className="text-base text-red-600 mb-3">오류: {error}</Text>
        <TouchableOpacity
          onPress={fetchUserData}
          className="bg-green-600 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">다시 시도</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-3 bg-gray-100 px-6 py-3 rounded-2xl"
        >
          <Text className="text-gray-600">이전 화면으로</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">사용자 정보를 불러올 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-safe">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        <MyPageHeader
          name={userData.name}
          onBack={Global.USER_ROLE === 'user' ? () => navigation.goBack() : undefined}
        />

        <View className="px-5">
          <ProfileCard data={userData} />

          <GeofenceList
            geofences={userData.geofences || []}
            onDelete={handleGeofenceDelete}
          />

          <SettingsCard
            onPasswordChange={() => setIsPasswordModalOpen(true)}
            onPrivacyPolicy={() => navigation.navigate('PrivacyPolicyPage' as never)}
            onLogout={handleLogout}
          />

          <View className="items-center pb-8">
            <Text className="text-xs text-gray-300">SafetyFence v1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation currentScreen="MyPage" />

      <PasswordChangeModal
        visible={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
    </SafeAreaView >
  );
};

export default MyPage;
