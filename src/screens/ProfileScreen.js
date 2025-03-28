import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, TextInput, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Driver',
    email: 'john.driver@example.com',
    phone: '+1 (555) 123-4567',
    vehicle: 'Toyota Camry',
    license: 'XYZ-123',
  });
  
  const [editableData, setEditableData] = useState({...profileData});

  const stats = [
    { id: '1', label: 'Total Routes', value: '18' },
    { id: '2', label: 'Saved Routes', value: '7' },
    { id: '3', label: 'Drive Time Saved', value: '3.5 hrs' },
  ];

  const handleEdit = () => {
    if (isEditing) {
      // Save the changes
      setProfileData({...editableData});
      Alert.alert('Profile Updated', 'Your profile information has been updated successfully.');
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditableData({...profileData});
    setIsEditing(false);
  };

  const handleTextChange = (key, value) => {
    setEditableData({...editableData, [key]: value});
  };

  const renderEditableField = (label, key, icon) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldIconContainer}>
        <FontAwesome name={icon} size={18} color="#2196F3" />
      </View>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editableData[key]}
            onChangeText={(text) => handleTextChange(key, text)}
          />
        ) : (
          <Text style={styles.fieldValue}>{profileData[key]}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.profileImage}
            />
            {isEditing && (
              <TouchableOpacity style={styles.editPhotoButton}>
                <FontAwesome name="camera" size={15} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={editableData.name}
              onChangeText={(text) => handleTextChange('name', text)}
            />
          ) : (
            <Text style={styles.name}>{profileData.name}</Text>
          )}
          <Text style={styles.email}>{profileData.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          {stats.map(stat => (
            <View key={stat.id} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderEditableField('Email', 'email', 'envelope')}
          {renderEditableField('Phone', 'phone', 'phone')}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          {renderEditableField('Vehicle Model', 'vehicle', 'car')}
          {renderEditableField('License Plate', 'license', 'id-card')}
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleEdit}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <FontAwesome name="edit" size={16} color="#FFF" style={styles.editIcon} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#2196F3',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  nameInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
    textAlign: 'center',
    padding: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  fieldIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  fieldContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#999',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  input: {
    fontSize: 16,
    color: '#333',
    padding: 0,
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editIcon: {
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 