
import { GalleryPhoto } from '../services/galleryService';

export interface Schedule {
    id: number; // geofenceId
    name: string;
    address: string;
    startTime: string;
    endTime: string;
    date: string;
    type: 'permanent' | 'temporary';
}

export interface Todo {
    id: number; // userEventId
    title: string;
    time: Date;
    description?: string;
    image?: string;
    date: string;
    type: 'todo';
}

export interface Log {
    id: number; // logId
    location: string;
    address: string;
    arriveTime: string;
    date: string;
    type: 'log';
}

export type CalendarItem =
    | (Schedule & { itemType: 'schedule' })
    | (Todo & { itemType: 'todo' })
    | (Log & { itemType: 'log' })
    | (GalleryPhoto & { itemType: 'photo' });
