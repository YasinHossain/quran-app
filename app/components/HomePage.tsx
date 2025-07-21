'use client';
import React, { useState, useMemo, useEffect } from 'react';

// --- Data for all 114 Surahs with English meanings ---
const allSurahs = [
    { number: 1, name: 'Al-Fatihah', arabicName: '\u0671\u0644\u0641\u064E\u0627\u062A\u0650\u062D\u064E\u0629', verses: 7, meaning: 'The Opening' },
    { number: 2, name: 'Al-Baqarah', arabicName: '\u0671\u0644\u0628\u064E\u0642\u064E\u0631\u064E\u0629', verses: 286, meaning: 'The Cow' },
    { number: 3, name: 'Aal-E-Imran', arabicName: '\u0622\u0644\u0650 \u0639\u0650\u0645\u0652\u0631\u064E\u0627\u0646', verses: 200, meaning: 'Family of Imran' },
    { number: 4, name: 'An-Nisa', arabicName: '\u0671\u0644\u0646\u0650\u0633\u064E\u0627\u0621', verses: 176, meaning: 'The Women' },
    { number: 5, name: 'Al-Maidah', arabicName: '\u0671\u0644\u0645\u064E\u0627\u0626\u0650\u062F\u064E\u0629', verses: 120, meaning: 'The Table Spread' },
    { number: 6, name: 'Al-Anam', arabicName: '\u0671\u0644\u0623\u064E\u0646\u0652\u0639\u064E\u0627\u0645', verses: 165, meaning: 'The Cattle' },
    { number: 7, name: 'Al-Araf', arabicName: '\u0671\u0644\u0623\u064E\u0639\u0652\u0631\u064E\u0627\u0641', verses: 206, meaning: 'The Heights' },
    { number: 8, name: 'Al-Anfal', arabicName: '\u0671\u0644\u0623\u064E\u0646\u0652\u0641\u064E\u0627\u0644', verses: 75, meaning: 'The Spoils of War' },
    { number: 9, name: 'At-Tawbah', arabicName: '\u0671\u0644\u062A\u064E\u0648\u0652\u0628\u064E\u0629', verses: 129, meaning: 'The Repentance' },
    { number: 10, name: 'Yunus', arabicName: '\u064a\u0648\u0646\u064f\u0633', verses: 109, meaning: 'Jonah' },
    { number: 11, name: 'Hud', arabicName: '\u0647\u064f\u0648\u062f', verses: 123, meaning: 'Hud' },
    { number: 12, name: 'Yusuf', arabicName: '\u064a\u064f\u0633\u064f\u0641', verses: 111, meaning: 'Joseph' },
    { number: 13, name: 'Ar-Rad', arabicName: '\u0671\u0644\u0631\u064e\u0639\u0652\u062f', verses: 43, meaning: 'The Thunder' },
    { number: 14, name: 'Ibrahim', arabicName: '\u0625\u0650\u0628\u0652\u0631\u064e\u0627\u0647\u0650\u064a\u0645', verses: 52, meaning: 'Abraham' },
    { number: 15, name: 'Al-Hijr', arabicName: '\u0671\u0644\u062D\u0650\u062C\u0652\u0631', verses: 99, meaning: 'The Rocky Tract' },
    { number: 16, name: 'An-Nahl', arabicName: '\u0671\u0644\u0646\u0651\u064e\u062D\u0652\u0644', verses: 128, meaning: 'The Bee' },
    { number: 17, name: 'Al-Isra', arabicName: '\u0671\u0644\u0625\u0650\u0633\u0652\u0631\u064e\u0627\u0621', verses: 111, meaning: 'The Night Journey' },
    { number: 18, name: 'Al-Kahf', arabicName: '\u0671\u0644\u0643\u064e\u0647\u0652\u0641', verses: 110, meaning: 'The Cave' },
    { number: 19, name: 'Maryam', arabicName: '\u0645\u064e\u0631\u0652\u064a\u064e\u0645', verses: 98, meaning: 'Mary' },
    { number: 20, name: 'Taha', arabicName: '\u0637\u0647', verses: 135, meaning: 'Ta-Ha' },
    { number: 21, name: 'Al-Anbiya', arabicName: '\u0671\u0644\u0623\u064e\u0646\u0652\u0628\u0650\u064a\u064e\u0627\u0621', verses: 112, meaning: 'The Prophets' },
    { number: 22, name: 'Al-Hajj', arabicName: '\u0671\u0644\u062D\u064e\u062c\u0651', verses: 78, meaning: 'The Pilgrimage' },
    { number: 23, name: 'Al-Muminun', arabicName: '\u0671\u0644\u0645\u064f\u0624\u0652\u0645\u0650\u0646\u064f\u0648\u0646', verses: 118, meaning: 'The Believers' },
    { number: 24, name: 'An-Nur', arabicName: '\u0671\u0644\u0646\u064f\u0648\u0631', verses: 64, meaning: 'The Light' },
    { number: 25, name: 'Al-Furqan', arabicName: '\u0671\u0644\u0641\u064f\u0631\u0652\u0642\u064e\u0627\u0646', verses: 77, meaning: 'The Criterion' },
    { number: 26, name: 'Ash-Shuara', arabicName: '\u0671\u0644\u0634\u0651\u064f\u0639\u064e\u0631\u064e\u0627\u0621', verses: 227, meaning: 'The Poets' },
    { number: 27, name: 'An-Naml', arabicName: '\u0671\u0644\u0646\u064e\u0645\u0652\u0644', verses: 93, meaning: 'The Ant' },
    { number: 28, name: 'Al-Qasas', arabicName: '\u0671\u0644\u0642\u064e\u0635\u064e\u0635', verses: 88, meaning: 'The Stories' },
    { number: 29, name: 'Al-Ankabut', arabicName: '\u0671\u0644\u0639\u064e\u0646\u0652\u0643\u064e\u0628\u064f\u0648\u062a', verses: 69, meaning: 'The Spider' },
    { number: 30, name: 'Ar-Rum', arabicName: '\u0671\u0644\u0631\u064f\u0648\u0645', verses: 60, meaning: 'The Romans' },
    { number: 31, name: 'Luqman', arabicName: '\u0644\u064f\u0642\u0645\u064e\u0627\u0646', verses: 34, meaning: 'Luqman' },
    { number: 32, name: 'As-Sajdah', arabicName: '\u0671\u0644\u0633\u064e\u062c\u0652\u062f\u064e\u0629', verses: 30, meaning: 'The Prostration' },
    { number: 33, name: 'Al-Ahzab', arabicName: '\u0671\u0644\u0623\u064e\u062d\u0652\u0632\u064E\u0627\u0628', verses: 73, meaning: 'The Combined Forces' },
    { number: 34, name: 'Saba', arabicName: '\u0633\u064e\u0628\u064e\u0623', verses: 54, meaning: 'Sheba' },
    { number: 35, name: 'Fatir', arabicName: '\u0641\u064e\u0627\u0637\u0650\u0631', verses: 45, meaning: 'Originator' },
    { number: 36, name: 'Ya-Sin', arabicName: '\u064a\u064e\u0633', verses: 83, meaning: 'Ya Sin' },
    { number: 37, name: 'As-Saffat', arabicName: '\u0671\u0644\u0635\u0651\u064e\u0627\u0641\u0651\u064e\u0627\u062a', verses: 182, meaning: 'Those who set the Ranks' },
    { number: 38, name: 'Sad', arabicName: '\u0635', verses: 88, meaning: 'The Letter "Saad"' },
    { number: 39, name: 'Az-Zumar', arabicName: '\u0671\u0644\u0632\u065f\u064f\u0645\u064e\u0631', verses: 75, meaning: 'The Troops' },
    { number: 40, name: 'Ghafir', arabicName: '\u063a\u064e\u0627\u0641\u0650\u0631', verses: 85, meaning: 'The Forgiver' },
    { number: 41, name: 'Fussilat', arabicName: '\u0641\u064f\u0635\u0650\u0651\u0644\u064e\u062a', verses: 54, meaning: 'Explained in Detail' },
    { number: 42, name: 'Ash-Shura', arabicName: '\u0671\u0644\u0634\u064f\u0648\u0631\u064E\u0649\u064e', verses: 53, meaning: 'The Consultation' },
    { number: 43, name: 'Az-Zukhruf', arabicName: '\u0671\u0644\u0632\u064f\u062e\u0652\u0631\u064f\u0641', verses: 89, meaning: 'The Ornaments of Gold' },
    { number: 44, name: 'Ad-Dukhan', arabicName: '\u0671\u0644\u062F\u0651\u065f\u062e\u064e\u064e\u0627\u0646', verses: 59, meaning: 'The Smoke' },
    { number: 45, name: 'Al-Jathiyah', arabicName: '\u0671\u0644\u062C\u064e\u0627\u062b\u0650\u064a\u064e\u0629', verses: 37, meaning: 'The Crouching' },
    { number: 46, name: 'Al-Ahqaf', arabicName: '\u0671\u0644\u0623\u064e\u062d\u0652\u0642\u064e\u0627\u0641', verses: 35, meaning: 'The Wind-Curved Sandhills' },
    { number: 47, name: 'Muhammad', arabicName: '\u0645\u064f\u062d\u064e\u0645\u0651\u064e\u062f', verses: 38, meaning: 'Muhammad' },
    { number: 48, name: 'Al-Fath', arabicName: '\u0671\u0644\u0641\u064e\u062a\u0652\u062d', verses: 29, meaning: 'The Victory' },
    { number: 49, name: 'Al-Hujurat', arabicName: '\u0671\u0644\u062d\u064f\u062c\u064f\u0631\u064e\u0627\u062a', verses: 18, meaning: 'The Rooms' },
    { number: 50, name: 'Qaf', arabicName: '\u0642', verses: 45, meaning: 'The Letter "Qaf"' },
    { number: 51, name: 'Adh-Dhariyat', arabicName: '\u0671\u0644\u0630\u0651\u064e\u0627\u0631\u0650\u064a\u064e\u0627\u062a', verses: 60, meaning: 'The Winnowing Winds' },
    { number: 52, name: 'At-Tur', arabicName: '\u0671\u0644\u0637\u064f\u0648\u0652\u0631', verses: 49, meaning: 'The Mount' },
    { number: 53, name: 'An-Najm', arabicName: '\u0671\u0644\u0646\u064e\u062c\u0652\u0645', verses: 62, meaning: 'The Star' },
    { number: 54, name: 'Al-Qamar', arabicName: '\u0671\u0644\u0642\u064e\u0645\u064e\u0631', verses: 55, meaning: 'The Moon' },
    { number: 55, name: 'Ar-Rahman', arabicName: '\u0671\u0644\u0631\u0651\u064e\u062d\u065f\u0645\u064e\u0646', verses: 78, meaning: 'The Most Merciful' },
    { number: 56, name: 'Al-Waqiah', arabicName: '\u0671\u0644\u0648\u064e\u0627\u0642\u0650\u0639\u064e\u0629', verses: 96, meaning: 'The Inevitable' },
    { number: 57, name: 'Al-Hadid', arabicName: '\u0671\u0644\u062D\u064e\u062f\u0650\u064a\u062F', verses: 29, meaning: 'The Iron' },
    { number: 58, name: 'Al-Mujadila', arabicName: '\u0671\u0644\u0645\u064f\u062c\u064e\u0627\u062f\u0650\u0644\u064e\u0629', verses: 22, meaning: 'The Pleading Woman' },
    { number: 59, name: 'Al-Hashr', arabicName: '\u0671\u0644\u062d\u064e\u0634\u0652\u0631', verses: 24, meaning: 'The Exile' },
    { number: 60, name: 'Al-Mumtahanah', arabicName: '\u0671\u0644\u0645\u064f\u0645\u0652\u062a\u064e\u062d\u064e\u0646\u064e\u0629', verses: 13, meaning: 'She that is to be examined' },
    { number: 61, name: 'As-Saff', arabicName: '\u0671\u0644\u0635\u0651\u064e\u0641', verses: 14, meaning: 'The Ranks' },
    { number: 62, name: 'Al-Jumuah', arabicName: '\u0671\u0644\u062c\u064f\u0645\u064f\u0639\u064e\u0629', verses: 11, meaning: 'The Congregation, Friday' },
    { number: 63, name: 'Al-Munafiqun', arabicName: '\u0671\u0644\u0645\u064f\u0646\u064e\u0641\u0650\u0642\u064f\u0648\u0646', verses: 11, meaning: 'The Hypocrites' },
    { number: 64, name: 'At-Taghabun', arabicName: '\u0671\u0644\u062A\u064e\u063a\u064e\u0627\u0628\u064f\u0646', verses: 18, meaning: 'The Mutual Disillusion' },
    { number: 65, name: 'At-Talaq', arabicName: '\u0671\u0644\u0637\u0651\u064e\u0644\u064e\u0642', verses: 12, meaning: 'The Divorce' },
    { number: 66, name: 'At-Tahrim', arabicName: '\u0671\u0644\u062A\u064e\u062d\u0652\u0631\u0650\u064a\u0645', verses: 12, meaning: 'The Prohibition' },
    { number: 67, name: 'Al-Mulk', arabicName: '\u0671\u0644\u0645\u064f\u0644\u0652\u0643', verses: 30, meaning: 'The Sovereignty' },
    { number: 68, name: 'Al-Qalam', arabicName: '\u0671\u0644\u0642\u064e\u0644\u064e\u0645', verses: 52, meaning: 'The Pen' },
    { number: 69, name: 'Al-Haqqah', arabicName: '\u0671\u0644\u062D\u064e\u0642\u0651\u064e\u0629', verses: 52, meaning: 'The Reality' },
    { number: 70, name: 'Al-Maarij', arabicName: '\u0671\u0644\u0645\u064e\u0639\u064e\u0627\u0631\u0650\u062c', verses: 44, meaning: 'The Ascending Stairways' },
    { number: 71, name: 'Nuh', arabicName: '\u0646\u064f\u0648\u062d', verses: 28, meaning: 'Noah' },
    { number: 72, name: 'Al-Jinn', arabicName: '\u0671\u0644\u062c\u0650\u0646\u0652\u0646', verses: 28, meaning: 'The Jinn' },
    { number: 73, name: 'Al-Muzzammil', arabicName: '\u0671\u0644\u0645\u064f\u0632\u0651\u064e\u0645\u0651\u0650\u0644', verses: 20, meaning: 'The Enshrouded One' },
    { number: 74, name: 'Al-Muddaththir', arabicName: '\u0671\u0644\u0645\u064f\u062f\u064e\u0651\u063b\u0651\u0650\u0631', verses: 56, meaning: 'The Cloaked One' },
    { number: 75, name: 'Al-Qiyamah', arabicName: '\u0671\u0644\u0642\u0650\u064a\u064e\u0627\u0645\u064e\u0629', verses: 40, meaning: 'The Resurrection' },
    { number: 76, name: 'Al-Insan', arabicName: '\u0671\u0644\u0625\u0650\u0646\u0652\u0633\u064e\u0627\u0646', verses: 31, meaning: 'Man' },
    { number: 77, name: 'Al-Mursalat', arabicName: '\u0671\u0644\u0645\u064f\u0631\u0652\u0633\u064e\u0644\u064e\u0627\u062a', verses: 50, meaning: 'The Emissaries' },
    { number: 78, name: 'An-Naba', arabicName: '\u0671\u0644\u0646\u064e\u0628\u064e\u0623', verses: 40, meaning: 'The Tidings' },
    { number: 79, name: 'An-Naziat', arabicName: '\u0671\u0644\u0646\u064e\u0627\u0632\u0650\u0639\u064e\u0627\u062a', verses: 46, meaning: 'Those who drag forth' },
    { number: 80, name: 'Abasa', arabicName: '\u0639\u064e\u0628\u064e\u0633', verses: 42, meaning: 'He Frowned' },
    { number: 81, name: 'At-Takwir', arabicName: '\u0671\u0644\u062A\u064e\u0643\u0652\u0648\u064a\u0652\u0631', verses: 29, meaning: 'The Overthrowing' },
    { number: 82, name: 'Al-Infitar', arabicName: '\u0671\u0644\u0625\u0650\u0646\u0652\u0641\u0650\u0637\u064e\u0627\u0631', verses: 19, meaning: 'The Cleaving' },
    { number: 83, name: 'Al-Mutaffifin', arabicName: '\u0671\u0644\u0645\u064f\u0637\u064e\u0641\u0651\u0650\u0641\u0650\u064a\u0646', verses: 36, meaning: 'The Defrauding' },
    { number: 84, name: 'Al-Inshiqaq', arabicName: '\u0671\u0644\u0625\u0650\u0646\u0652\u0634\u0650\u0642\u064e\u0627\u0642', verses: 25, meaning: 'The Sundering' },
    { number: 85, name: 'Al-Buruj', arabicName: '\u0671\u0644\u0628\u064f\u0631\u064f\u0648\u062c', verses: 22, meaning: 'The Mansions of the Stars' },
    { number: 86, name: 'At-Tariq', arabicName: '\u0671\u0644\u0637\u064e\u0631\u0650\u0642', verses: 17, meaning: 'The Nightcommer' },
    { number: 87, name: 'Al-Ala', arabicName: '\u0671\u0644\u0623\u064e\u0639\u0652\u0644\u064e\u0649\u064e', verses: 19, meaning: 'The Most High' },
    { number: 88, name: 'Al-Ghashiyah', arabicName: '\u0671\u0644\u063a\u064e\u0627\u0634\u0650\u064a\u064e\u0629', verses: 26, meaning: 'The Overwhelming' },
    { number: 89, name: 'Al-Fajr', arabicName: '\u0671\u0644\u0641\u064e\u062c\u0652\u0631', verses: 30, meaning: 'The Dawn' },
    { number: 90, name: 'Al-Balad', arabicName: '\u0671\u0644\u0628\u064e\u0644\u064e\u062f', verses: 20, meaning: 'The City' },
    { number: 91, name: 'Ash-Shams', arabicName: '\u0671\u0644\u0634\u0651\u064e\u0645\u0652\u0633', verses: 15, meaning: 'The Sun' },
    { number: 92, name: 'Al-Layl', arabicName: '\u0671\u0644\u0644\u064e\u064a\u0652\u0644', verses: 21, meaning: 'The Night' },
    { number: 93, name: 'Ad-Duha', arabicName: '\u0671\u0644\u0636\u064f\u062d\u064e\u0649\u064e', verses: 11, meaning: 'The Forenoon' },
    { number: 94, name: 'Ash-Sharh', arabicName: '\u0671\u0644\u0634\u0651\u064e\u0631\u0652\u062d', verses: 8, meaning: 'The Relief' },
    { number: 95, name: 'At-Tin', arabicName: '\u0671\u0644\u062A\u0650\u0651\u064a\u0652\u0646', verses: 8, meaning: 'The Fig' },
    { number: 96, name: 'Al-Alaq', arabicName: '\u0671\u0644\u0639\u064e\u0644\u064e\u0642', verses: 19, meaning: 'The Clot' },
    { number: 97, name: 'Al-Qadr', arabicName: '\u0671\u0644\u0642\u064e\u062f\u0652\u0631', verses: 5, meaning: 'The Power' },
    { number: 98, name: 'Al-Bayyinah', arabicName: '\u0671\u0644\u0628\u064e\u064a\u0651\u0650\u0646\u064e\u0629', verses: 8, meaning: 'The Clear Proof' },
    { number: 99, name: 'Az-Zalzalah', arabicName: '\u0671\u0644\u0632\u064e\u0644\u0652\u0632\u064e\u0644\u064e\u0629', verses: 8, meaning: 'The Earthquake' },
    { number: 100, name: 'Al-Adiyat', arabicName: '\u0671\u0644\u0639\u064e\u0627\u062f\u0650\u064a\u064e\u0627\u062a', verses: 11, meaning: 'The Courser' },
    { number: 101, name: 'Al-Qariah', arabicName: '\u0671\u0644\u0642\u064e\u0627\u0631\u0650\u0639\u064e\u0629', verses: 11, meaning: 'The Calamity' },
    { number: 102, name: 'At-Takathur', arabicName: '\u0671\u0644\u062A\u064e\u0643\u064e\u0627\u062b\u064f\u0631', verses: 8, meaning: 'The Piling Up' },
    { number: 103, name: 'Al-Asr', arabicName: '\u0671\u0644\u0639\u064e\u0635\u0652\u0631', verses: 3, meaning: 'The Declining Day' },
    { number: 104, name: 'Al-Humazah', arabicName: '\u0671\u0644\u0647\u064f\u0645\u064e\u0632\u064e\u0629', verses: 9, meaning: 'The Traducer' },
    { number: 105, name: 'Al-Fil', arabicName: '\u0671\u0644\u0641\u0650\u064a\u0652\u0644', verses: 5, meaning: 'The Elephant' },
    { number: 106, name: 'Quraysh', arabicName: '\u0642\u064f\u0631\u064e\u064a\u0652\u0634', verses: 4, meaning: 'Quraysh' },
    { number: 107, name: 'Al-Maun', arabicName: '\u0671\u0644\u0645\u064e\u0627\u0639\u064f\u0648\u0646', verses: 7, meaning: 'The Small Kindnesses' },
    { number: 108, name: 'Al-Kawthar', arabicName: '\u0671\u0644\u0643\u064e\u0648\u0652\u062b\u064e\u0631', verses: 3, meaning: 'The Abundance' },
    { number: 109, name: 'Al-Kafirun', arabicName: '\u0671\u0644\u0643\u064e\u0627\u0641\u0650\u0631\u064f\u0648\u0646', verses: 6, meaning: 'The Disbelievers' },
    { number: 110, name: 'An-Nasr', arabicName: '\u0671\u0644\u0646\u064e\u0635\u0652\u0631', verses: 3, meaning: 'The Divine Support' },
    { number: 111, name: 'Al-Masad', arabicName: '\u0671\u0644\u0645\u064e\u0633\u064e\u062f', verses: 5, meaning: 'The Palm Fiber' },
    { number: 112, name: 'Al-Ikhlas', arabicName: '\u0671\u0644\u0625\u0650\u062e\u0652\u0644\u064e\u0627\u0635', verses: 4, meaning: 'The Sincerity' },
    { number: 113, name: 'Al-Falaq', arabicName: '\u0671\u0644\u0641\u064e\u0644\u064e\u0642', verses: 5, meaning: 'The Daybreak' },
    { number: 114, name: 'An-Nas', arabicName: '\u0671\u0644\u0646\u064e\u0627\u0633', verses: 6, meaning: 'Mankind' },
];

const allJuz = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  name: `Juz ${i + 1}`,
  surahRange: 'Al-Fatihah 1 - Al-Baqarah 141',
}));

// --- SVG Icon Components ---
const Search = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Sun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const Moon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// --- Main Page Component ---
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>('Surah');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Inter:wght@300;400;500;600;700&display=swap');

    body {
      font-family: 'Inter', sans-serif;
      background-color: #f8fafc;
      transition: background-color 0.3s ease;
    }

    .dark body {
      background-color: #020617;
    }

    .font-amiri {
      font-family: 'Amiri', serif;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
    .animation-delay-200 { animation-delay: 200ms; }
    .animation-delay-400 { animation-delay: 400ms; }
    .animation-delay-600 { animation-delay: 600ms; }
    .content-visibility-auto { opacity: 0; }
  `;

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return allSurahs;
    return allSurahs.filter(surah =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  const shortcutSurahs = ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'];

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen w-full text-slate-800 dark:text-slate-200 bg-gradient-to-br from-cyan-50/20 via-white to-emerald-50/20 dark:bg-gray-900 dark:from-gray-900 dark:to-slate-900 overflow-x-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="absolute top-[-10rem] right-[-10rem] w-72 h-72 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full filter blur-3xl opacity-50" />
          <div className="absolute bottom-[-5rem] left-[-10rem] w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full filter blur-3xl opacity-40" />
          <div className="absolute bottom-[20rem] right-[-15rem] w-96 h-96 bg-sky-400/10 dark:bg-sky-500/10 rounded-full filter blur-3xl opacity-30" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 lg:px-8">
          <header className="w-full py-4">
            <nav className="flex justify-between items-center max-w-7xl mx-auto p-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-slate-700/60 rounded-2xl shadow-lg backdrop-blur-xl">
              <h1 className="text-2xl font-bold tracking-wider text-slate-900 dark:text-white">Al Qur'an</h1>
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              </button>
            </nav>
          </header>

          <main className="flex-grow flex flex-col items-center justify-center text-center pt-20 pb-10">
            <div className="content-visibility-auto animate-fade-in-up">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                The Noble Qur'an
              </h2>
              <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Read! In the name of your Lord
              </p>
            </div>

            <div className="mt-10 w-full max-w-xl mx-auto content-visibility-auto animate-fade-in-up animation-delay-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you want to read?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-4 pr-12 text-lg bg-white/40 dark:bg-slate-800/40 border-white/20 dark:border-slate-700/50 rounded-xl backdrop-blur-md focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-lg placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 dark:text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 content-visibility-auto animate-fade-in-up animation-delay-200">
              {shortcutSurahs.map(name => (
                <button key={name} className="px-5 py-2 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-full backdrop-blur-md hover:bg-white/60 dark:hover:bg-slate-700/60 hover:scale-105 transform transition-all duration-200 text-slate-700 dark:text-slate-300 font-medium shadow-sm hover:shadow-md">
                  {name}
                </button>
              ))}
            </div>

            <div className="mt-12 w-full max-w-3xl p-6 md:p-8 bg-white/30 dark:bg-slate-800/30 border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400">
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Verse of the Day</p>
              <h3 className="font-amiri text-3xl md:text-4xl text-emerald-600 dark:text-emerald-400 leading-relaxed text-right" dir="rtl">
                فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا
              </h3>
              <p className="mt-4 text-left text-slate-600 dark:text-slate-400 text-sm">"So, surely with hardship comes ease." - [Surah Ash-Sharh, 94:5]</p>
            </div>
          </main>

          <section id="surahs" className="py-20 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8 content-visibility-auto animate-fade-in-up animation-delay-600">
              <h2 className="text-3xl font-bold dark:text-white">All Surahs</h2>
              <div className="flex items-center bg-black/5 dark:bg-slate-800/60 p-1 rounded-full">
                <button onClick={() => setActiveTab('Surah')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'Surah' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}>Surah</button>
                <button onClick={() => setActiveTab('Juz')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'Juz' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}>Juz</button>
                <button onClick={() => setActiveTab('Page')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'Page' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}>Page</button>
              </div>
            </div>

            {activeTab === 'Surah' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSurahs.map((surah, index) => (
                  <a
                    href="#"
                    key={surah.number}
                    className="group p-5 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/60 dark:hover:bg-slate-700/60 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 content-visibility-auto animate-fade-in-up"
                    style={{ animationDelay: `${600 + index * 15}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-black/5 dark:bg-slate-700/50 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-lg group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 transition-colors">
                          {surah.number}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{surah.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{surah.meaning}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-amiri text-2xl text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {surah.arabicName}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{surah.verses} Verses</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
            {activeTab === 'Juz' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allJuz.map((juz, index) => (
                  <a
                    href="#"
                    key={juz.number}
                    className="group p-5 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/60 dark:hover:bg-slate-700/60 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 content-visibility-auto animate-fade-in-up"
                    style={{ animationDelay: `${100 + index * 15}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-black/5 dark:bg-slate-700/50 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-lg group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 transition-colors">
                          {juz.number}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{juz.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{juz.surahRange}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
            {activeTab === 'Page' && (
              <div className="text-center py-20 bg-white/30 dark:bg-slate-800/30 border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up">
                <p className="text-slate-500 dark:text-slate-400 text-lg">Page view is not yet implemented.</p>
              </div>
            )}

            {filteredSurahs.length === 0 && activeTab === 'Surah' && (
              <div className="text-center py-10 col-span-full content-visibility-auto animate-fade-in-up">
                <p className="text-slate-500 dark:text-slate-400">No Surahs found for your search.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
