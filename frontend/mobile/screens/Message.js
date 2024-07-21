import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
function Message(){
  return (
  <view>
      <ScrollView horizontal contentContainerStyle={styles.amisEnLigneList}>
        <TouchableOpacity>
          <Image source={require('../assets/hero1.jpg')} style={styles.amisEnLigneAvatar} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/hero2.jpg')} style={styles.amisEnLigneAvatar} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/hero3.jpg')} style={styles.amisEnLigneAvatar} />
        </TouchableOpacity>
      </ScrollView>
  </view>
  );
}
export default Message;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    padding: 10,
  },
  currentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  statusButton: {
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: -10,
    right: 30,
    bottom: 14
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  discussionContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  onlineIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: '#fff',
    bottom: -2,
    right: 12,
    shadowColor: 'green',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dernierMessage: {
    color: '#888',
  },
  searchInput: {
    height: 40,
    width: '70%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 90,
    paddingLeft: 10,
    marginBottom: 30,
    marginTop: -70,
  },
  amisEnLigneList: {
    marginBottom: 10,
  },
  amisEnLigneAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
})
