import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config/api';

const languages = [
    { name: 'English', code: 'en' },
    { name: 'Sinhala', code: 'si' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Italian', code: 'it' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Russian', code: 'ru' },
];

export default function PreferredLanguageScreen() {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        loadSelectedLanguage();
    }, []);

    const loadSelectedLanguage = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                if (data.data.preferredLanguage) {
                    setSelectedLanguage(data.data.preferredLanguage);
                }
                if (data.data.role) {
                    setUserRole(data.data.role);
                }
            }
        } catch (error) {
            console.error('Error loading preferred language:', error);
        }
    };

    const saveSelectedLanguage = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/language`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ languageCode: selectedLanguage }),
            });
            const data = await response.json();
            if (data.success) {
                Alert.alert('Success', 'Preferred language saved successfully!');
                if (userRole === 'tutor') {
                    router.replace('/(tabs)/(tutor_tabs)/profile');
                } else {
                    router.replace('/(tabs)/(student_tabs)/profile');
                }
            } else {
                Alert.alert('Error', data.message || 'Failed to save preferred language.');
            }
        } catch (error) {
            console.error('Error saving preferred language:', error);
            Alert.alert('Error', 'Network error occurred. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (userRole === 'tutor') {
                        router.replace('/(tabs)/(tutor_tabs)/profile');
                    } else {
                        router.replace('/(tabs)/(student_tabs)/profile');
                    }
                }} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.title}>Preferred Language</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <Text style={styles.description}>
                    Select your preferred language for the app interface.
                </Text>

                {languages.map((language) => (
                    <TouchableOpacity
                        key={language.code}
                        style={[
                            styles.languageItem,
                            selectedLanguage === language.code && styles.selectedItem,
                        ]}
                        onPress={() => setSelectedLanguage(language.code)}
                    >
                        <View style={styles.languageContent}>
                            <Text style={styles.languageName}>{language.name}</Text>
                            <Text style={styles.languageCode}>({language.code})</Text>
                        </View>
                        {selectedLanguage === language.code && (
                            <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={saveSelectedLanguage}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    description: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 20,
        lineHeight: 22,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedItem: {
        borderColor: '#3b82f6',
        borderWidth: 2,
    },
    languageContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    languageName: {
        fontSize: 16,
        color: '#1e293b',
        marginRight: 8,
    },
    languageCode: {
        fontSize: 14,
        color: '#64748b',
    },
    footer: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    saveButton: {
        backgroundColor: '#3b82f6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
