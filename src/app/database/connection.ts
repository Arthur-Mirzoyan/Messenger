import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB6GS7VqZ8_pDYSlotYu7Y6r97N9p3zxyI',
  authDomain: 'project-ddee7.firebaseapp.com',
  projectId: 'project-ddee7',
  storageBucket: 'project-ddee7.appspot.com',
  messagingSenderId: '1028656394145',
  appId: '1:1028656394145:web:095dfb5f047ad83730a5e0',
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
