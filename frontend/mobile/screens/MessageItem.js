import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageItem = ({ conversation, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const handleDelete = () => {
    setIsDeleteVisible(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    // Simulation de la suppression du message
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteVisible(false);
      onDelete(); // Appeler la fonction de suppression du parent
    }, 2000);
  };

  return (
    <View style={styles.messageItem}>
      <TouchableOpacity style={styles.container} onPress={handleDelete}>
        <Image source={conversation.avatar} style={styles.profileImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{conversation.name}</Text>
          <Text style={styles.messageText}>{conversation.lastMessage}</Text>
        </View>
      </TouchableOpacity>
      {isDeleteVisible && (
        <View style={styles.deleteContainer}>
          {isDeleting ? (
            <ActivityIndicator size="small" color="#FF084B" />
          ) : (
            <>
              <TouchableOpacity onPress={confirmDelete}>
                <Ionicons name="trash" size={24} color="#FF084B" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsDeleteVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageText: {
    color: '#888',
  },
  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MessageItem;