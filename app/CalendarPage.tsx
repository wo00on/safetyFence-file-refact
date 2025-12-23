
import Global from '@/constants/Global';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar, Plus } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import LogCard from '../components/calendar/LogCard';
import PhotoCard from '../components/calendar/PhotoCard';
import ScheduleCard from '../components/calendar/ScheduleCard';
import TodoCard from '../components/calendar/TodoCard';
import TodoModal from '../components/TodoModal';
import { useCalendarData } from '../hooks/useCalendarData';
import { CalendarItem } from '../types/calendar';

// --- 상수 ---
const today = new Date();
const todayDateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

// --- 캘린더 날짜 유틸리티 ---
const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  // 해당 월의 총 일수
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // 1일의 요일을 직접 계산
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const days: (number | null)[] = [];

  // 1일 이전 빈 칸 채우기
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // 실제 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // 마지막 주를 7의 배수로 맞추기
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};

// --- 메인 캘린더 페이지 컴포넌트 ---
const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [isTodoModalVisible, setIsTodoModalVisible] = useState(false);

  const {
    loadCalendarData,
    handleTodoSave,
    handleTodoDelete,
    hasItemsOnDate,
    getSortedItemsForDate
  } = useCalendarData(todayDateStr);

  useFocusEffect(
    useCallback(() => {
      loadCalendarData();
    }, [loadCalendarData])
  );

  const sortedSelectedDateItems = useMemo(() => getSortedItemsForDate(selectedDate), [getSortedItemsForDate, selectedDate]);
  const daysInMonth = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  const renderItem = ({ item }: { item: CalendarItem }) => {
    if (item.itemType === 'log') {
      return <LogCard key={`log-${item.id}`} log={item} />;
    } else if (item.itemType === 'schedule') {
      return <ScheduleCard key={`schedule-${item.id}`} schedule={item} />;
    } else if (item.itemType === 'photo') {
      return <PhotoCard key={`photo-${item.id}`} photo={item} />;
    } else {
      return <TodoCard key={`todo-${item.id}`} todo={item} onDelete={handleTodoDelete} />;
    }
  };

  const handleSaveTodo = (data: { title: string; time: Date; description?: string }) => {
    handleTodoSave(selectedDate, data);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-safe">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        {/* 헤더 */}
        <View className="px-5 pt-5 pb-4">
          <Text className="text-3xl font-bold text-gray-900">
            {Global.USER_ROLE === 'supporter' && Global.TARGET_NUMBER
              ? `${(Global.TARGET_RELATION || Global.TARGET_NUMBER)}의 캘린더`
              : '캘린더'}
          </Text>
        </View>

        {/* 캘린더 카드 */}
        <View className="bg-white rounded-xl shadow-md p-4 mx-4 mb-6">
          {/* 월 네비게이션 */}
          <View className="flex-row items-center justify-between mb-4 px-2">
            <TouchableOpacity
              onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 rounded-full active:bg-gray-100">
              <Text className="text-xl font-bold text-gray-500">‹</Text>
            </TouchableOpacity>

            <Text className="text-lg font-semibold text-gray-900">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </Text>

            <TouchableOpacity
              onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 rounded-full active:bg-gray-100">
              <Text className="text-xl font-bold text-gray-500">›</Text>
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View className="flex-row mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <View key={day} className="flex-1 items-center py-2">
                <Text className="text-sm font-medium text-gray-400">{day}</Text>
              </View>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View>
            {Array.from({ length: Math.ceil(daysInMonth.length / 7) }, (_, weekIndex) => {
              const weekStart = weekIndex * 7;
              const weekDays = daysInMonth.slice(weekStart, weekStart + 7);

              return (
                <View key={weekIndex} style={{ flexDirection: 'row' }}>
                  {weekDays.map((day, dayIndex) => {
                    const index = weekStart + dayIndex;
                    const dateStr = day ? `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === todayDateStr;
                    const hasItems = day ? hasItemsOnDate(currentMonth, day) : false;

                    return (
                      <View
                        key={index}
                        style={{
                          flex: 1,
                          aspectRatio: 1,
                          padding: 4,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {day ? (
                          <TouchableOpacity
                            onPress={() => setSelectedDate(dateStr)}
                            activeOpacity={0.8}
                            style={{
                              width: '92%',
                              height: '92%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 999,
                              backgroundColor: isSelected ? '#25eb67ff' : isToday ? '#DBEAFE' : 'transparent',
                            }}
                          >
                            <Text style={{
                              fontSize: 13,
                              color: isSelected ? '#ffffff' : isToday ? '#2563eb' : hasItems ? '#374151' : '#9CA3AF',
                              fontWeight: isSelected || isToday || hasItems ? '600' as any : '400' as any,
                            }}>
                              {day}
                            </Text>
                            {!isSelected && !isToday && hasItems && (
                              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2563eb', marginTop: 4 }} />
                            )}
                          </TouchableOpacity>
                        ) : (
                          <View style={{ width: '92%', height: '92%' }} />
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="text-xl font-bold text-gray-900">
              {formatDate(selectedDate)}
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-green-500 px-3.5 py-2 rounded-lg shadow-sm"
              onPress={() => setIsTodoModalVisible(true)}
            >
              <Plus size={18} color="white" />
              <Text className="text-white text-sm font-semibold ml-1">할 일 추가</Text>
            </TouchableOpacity>
          </View>

          {sortedSelectedDateItems.length > 0 ? (
            sortedSelectedDateItems.map(item => renderItem({ item }))
          ) : (
            <View className="items-center justify-center pt-16">
              <Calendar size={48} color="#cbd5e1" />
              <Text className="text-gray-500 text-lg mt-4">등록된 일정이 없습니다</Text>
              <Text className="text-gray-400 text-sm mt-1">버튼을 눌러 새 할 일을 추가해 보세요</Text>
            </View>
          )}
        </View>

      </ScrollView>

      <BottomNavigation currentScreen="CalendarPage" />

      <TodoModal
        visible={isTodoModalVisible}
        onClose={() => setIsTodoModalVisible(false)}
        onSave={handleSaveTodo}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
};

// --- 헬퍼 함수 ---
const formatDate = (dateStr: string) => {
  if (!dateStr) return "날짜 선택";
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
};

export default CalendarPage;
