import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const StopDetailsModal = ({ 
  visible, 
  onClose, 
  onSave, 
  stopData,
  initialDetails = {}
}) => {
  const [details, setDetails] = React.useState({
    customerName: '',
    phoneNumber: '',
    startTime: '',
    endTime: '',
    notes: '',
    ...initialDetails
  });

  const [showStartTimePicker, setShowStartTimePicker] = React.useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState({});

  React.useEffect(() => {
    if (visible) {
      setDetails({ ...initialDetails });
      setValidationErrors({});
    }
  }, [visible, initialDetails]);

  const validatePhoneNumber = (number) => {
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(number.replace(/\s+/g, ''));
  };

  const validateTimeRange = () => {
    if (!details.startTime || !details.endTime) return true;
    
    const [startTime, startPeriod] = details.startTime.split(' ');
    const [endTime, endPeriod] = details.endTime.split(' ');
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const start = new Date();
    start.setHours(
      startPeriod === 'PM' ? 
        (startHour === 12 ? 12 : startHour + 12) : 
        (startHour === 12 ? 0 : startHour),
      startMinute
    );
    
    const end = new Date();
    end.setHours(
      endPeriod === 'PM' ? 
        (endHour === 12 ? 12 : endHour + 12) : 
        (endHour === 12 ? 0 : endHour),
      endMinute
    );
    
    return end > start;
  };

  const handleSave = () => {
    const errors = {};
    
    if (details.phoneNumber && !validatePhoneNumber(details.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!validateTimeRange()) {
      errors.timeRange = 'End time must be after start time';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    onSave(details);
    onClose();
  };

  const handleTimeChange = (type) => (event, selectedTime) => {
    if (type === 'start') {
      setShowStartTimePicker(false);
    } else {
      setShowEndTimePicker(false);
    }
    
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      setDetails({ 
        ...details, 
        [type === 'start' ? 'startTime' : 'endTime']: timeString 
      });
      
      // Clear validation error when times are changed
      if (validationErrors.timeRange) {
        setValidationErrors({ ...validationErrors, timeRange: null });
      }
    }
  };

  const handlePhoneNumberChange = (text) => {
    if (validationErrors.phoneNumber) {
      setValidationErrors({ ...validationErrors, phoneNumber: null });
    }
    setDetails({ ...details, phoneNumber: text });
  };

  const getInitialTime = (type) => {
    const timeStr = type === 'start' ? details.startTime : details.endTime;
    if (timeStr) {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(
        period === 'PM' ? 
          (parseInt(hours) === 12 ? 12 : parseInt(hours) + 12) : 
          (parseInt(hours) === 12 ? 0 : parseInt(hours))
      );
      date.setMinutes(parseInt(minutes));
      return date;
    }
    return new Date();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Stop Details</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Address Display */}
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-on" size={20} color="#4CAF50" />
              <Text style={styles.addressText} numberOfLines={2}>
                {stopData?.address || 'Selected Stop'}
              </Text>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Customer Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Customer Name</Text>
                <TextInput
                  style={styles.input}
                  value={details.customerName}
                  onChangeText={(text) => setDetails({ ...details, customerName: text })}
                  placeholder="Enter customer name"
                  placeholderTextColor="#999"
                  returnKeyType="next"
                />
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.phoneNumber && styles.inputError
                  ]}
                  value={details.phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />
                {validationErrors.phoneNumber && (
                  <Text style={styles.errorText}>{validationErrors.phoneNumber}</Text>
                )}
              </View>

              {/* Time Range */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Time Slot</Text>
                <View style={styles.timeRangeContainer}>
                  {/* Start Time */}
                  <TouchableOpacity 
                    style={[styles.input, styles.timeInput, styles.timeRangeInput]}
                    onPress={() => setShowStartTimePicker(true)}
                  >
                    <Text style={[
                      styles.timeText,
                      !details.startTime && styles.placeholderText
                    ]}>
                      {details.startTime || 'Start time'}
                    </Text>
                    <MaterialIcons name="access-time" size={20} color="#666" />
                  </TouchableOpacity>

                  <Text style={styles.timeRangeSeparator}>to</Text>

                  {/* End Time */}
                  <TouchableOpacity 
                    style={[styles.input, styles.timeInput, styles.timeRangeInput]}
                    onPress={() => setShowEndTimePicker(true)}
                  >
                    <Text style={[
                      styles.timeText,
                      !details.endTime && styles.placeholderText
                    ]}>
                      {details.endTime || 'End time'}
                    </Text>
                    <MaterialIcons name="access-time" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                {validationErrors.timeRange && (
                  <Text style={styles.errorText}>{validationErrors.timeRange}</Text>
                )}
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={details.notes}
                  onChangeText={(text) => setDetails({ ...details, notes: text })}
                  placeholder="Add any additional notes"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Details</Text>
              </TouchableOpacity>
            </View>

            {/* Time Pickers */}
            {showStartTimePicker && (
              <DateTimePicker
                value={getInitialTime('start')}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handleTimeChange('start')}
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={getInitialTime('end')}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handleTimeChange('end')}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  addressText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  timeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRangeInput: {
    flex: 1,
  },
  timeRangeSeparator: {
    marginHorizontal: 10,
    color: '#666',
    fontWeight: '500',
  },
});

export default StopDetailsModal; 