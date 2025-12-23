
import { Image as ImageIcon } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { GalleryPhoto } from '../../services/galleryService';

interface Props {
    photo: GalleryPhoto;
}

const PhotoCard: React.FC<Props> = React.memo(({ photo }) => (
    <View className="bg-white rounded-xl shadow p-4 mb-3 border border-gray-100">
        <View className="flex-row items-start">
            <View className="h-11 w-11 bg-orange-50 rounded-lg items-center justify-center mr-3">
                <ImageIcon size={20} color="#F97316" />
            </View>
            <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 mb-1">{photo.title || '갤러리 사진'}</Text>
                <Image source={{ uri: photo.uri }} className="w-full h-48 rounded-lg my-2" resizeMode="cover" />
                {photo.description && (
                    <Text className="text-sm text-gray-500 mb-2">{photo.description}</Text>
                )}
                <View className="self-start px-2.5 py-1 rounded-full bg-orange-100">
                    <Text className="text-xs font-semibold text-orange-700">
                        갤러리
                    </Text>
                </View>
            </View>
        </View>
    </View>
));

export default PhotoCard;
