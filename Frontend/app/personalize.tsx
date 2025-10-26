import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
    Animated,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { availableSubjects, availableTags } from "../config/tagList";
import { API_BASE_URL } from "../config/api";

const { width } = Dimensions.get("window");

export default function PersonalizeContentScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState(availableSubjects);
    const [filteredTags, setFilteredTags] = useState(availableTags);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'subjects' | 'tags'>('subjects');
    const [showTooltip, setShowTooltip] = useState(true);
    const [itemsToShow, setItemsToShow] = useState(10);

    const loadMoreItems = () => {
        setItemsToShow(prev => prev + 10);
    };

    const resetItemsToShow = () => {
        setItemsToShow(10);
    };

    useEffect(() => {
        // Filter subjects based on search query
        const filteredSubs = availableSubjects.filter(subject =>
            subject.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSubjects(filteredSubs);

        // Filter tags based on search query
        const filteredTgs = availableTags.filter(tag =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTags(filteredTgs);

        // Reset items to show when search changes
        resetItemsToShow();
    }, [searchQuery]);

    const toggleSubject = (subject: string) => {
        setSelectedSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleSave = async () => {
        if (selectedSubjects.length === 0 && selectedTags.length === 0) {
            Alert.alert("No Selection", "Please select at least one subject or tag.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    subjects: selectedSubjects,
                    tags: selectedTags,
                }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert("Success", data.message || "Preferences updated successfully", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            } else {
                Alert.alert("Error", data.message || "Failed to save preferences");
            }
        } catch (error) {
            console.error('Save preferences error:', error);
            Alert.alert("Error", "Network error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: string }) => {
        const isSelected = activeTab === 'subjects' ? selectedSubjects.includes(item) : selectedTags.includes(item);
        const toggleFunction = activeTab === 'subjects' ? toggleSubject : toggleTag;

        return (
            <TouchableOpacity
                style={[
                    styles.tagItem,
                    isSelected && styles.tagItemSelected
                ]}
                onPress={() => toggleFunction(item)}
            >
                <Text style={[
                    styles.tagText,
                    isSelected && styles.tagTextSelected
                ]}>
                    {item}
                </Text>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="middle">Personalize Content</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search subjects and tags..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {selectedSubjects.length + selectedTags.length} of {availableSubjects.length + availableTags.length} selected
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${((selectedSubjects.length + selectedTags.length) / (availableSubjects.length + availableTags.length)) * 100}%`
                                }
                            ]}
                        />
                    </View>
                </View>

                {/* Tooltip */}
                {showTooltip && (
                    <View style={styles.tooltipContainer}>
                        <View style={styles.tooltip}>
                            <Ionicons name="bulb" size={20} color="#667eea" />
                            <Text style={styles.tooltipText}>
                                Tap subjects and tags to personalize your learning experience!
                            </Text>
                            <TouchableOpacity
                                style={styles.tooltipClose}
                                onPress={() => setShowTooltip(false)}
                            >
                                <Ionicons name="close" size={16} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'subjects' && styles.tabActive]}
                        onPress={() => setActiveTab('subjects')}
                    >
                        <Text style={[styles.tabText, activeTab === 'subjects' && styles.tabTextActive]}>
                            Subjects ({selectedSubjects.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'tags' && styles.tabActive]}
                        onPress={() => setActiveTab('tags')}
                    >
                        <Text style={[styles.tabText, activeTab === 'tags' && styles.tabTextActive]}>
                            Tags ({selectedTags.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {activeTab === 'subjects' ? 'Choose Subjects' : 'Select Tags'}
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        {activeTab === 'subjects'
                            ? 'Pick subjects that interest you most'
                            : 'Choose specific topics and skills to explore'
                        }
                    </Text>
                    <FlatList
                        data={(activeTab === 'subjects' ? filteredSubjects : filteredTags).slice(0, itemsToShow)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item}
                        numColumns={2}
                        scrollEnabled={false}
                        contentContainerStyle={styles.tagsGrid}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="search" size={48} color="#ccc" />
                                <Text style={styles.emptyText}>No items found</Text>
                            </View>
                        }
                        ListFooterComponent={
                            (activeTab === 'subjects' ? filteredSubjects : filteredTags).length > itemsToShow ? (
                                <TouchableOpacity
                                    style={styles.loadMoreButton}
                                    onPress={loadMoreItems}
                                >
                                    <Text style={styles.loadMoreText}>Load More</Text>
                                    <Ionicons name="chevron-down" size={20} color="#667eea" />
                                </TouchableOpacity>
                            ) : null
                        }
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? "Saving..." : "Save Preferences"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
        textAlign: "center",
    },
    headerSpacer: {
        width: 40,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    summaryContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },
    selectedItems: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    selectedTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#667eea",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    selectedTagText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
    },
    tagsGrid: {
        gap: 10,
    },
    tagItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        minHeight: 50,
    },
    tagItemSelected: {
        backgroundColor: "#667eea",
        shadowColor: "#667eea",
        shadowOpacity: 0.3,
    },
    tagText: {
        fontSize: 14,
        color: "#333",
        flex: 1,
    },
    tagTextSelected: {
        color: "#fff",
        fontWeight: "600",
    },
    saveButton: {
        backgroundColor: "#667eea",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#667eea",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    progressContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    progressText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
        textAlign: "center",
    },
    progressBar: {
        height: 6,
        backgroundColor: "#e0e0e0",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#667eea",
        borderRadius: 3,
    },
    tooltipContainer: {
        marginBottom: 20,
    },
    tooltip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e8f4fd",
        borderRadius: 12,
        padding: 15,
        borderLeftWidth: 4,
        borderLeftColor: "#667eea",
    },
    tooltipText: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        marginLeft: 10,
    },
    tooltipClose: {
        padding: 5,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: "#667eea",
    },
    tabText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#666",
    },
    tabTextActive: {
        color: "#fff",
    },
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        marginTop: 10,
    },
    loadMoreButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    loadMoreText: {
        fontSize: 16,
        color: "#667eea",
        fontWeight: "600",
        marginRight: 8,
    },
});
