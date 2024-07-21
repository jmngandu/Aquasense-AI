import { View, TextInput, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons, FontAwesome, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/core';
import pdfIcon from './../assets/pdf.png';
import docxIcon from './../assets/docx.png';
import excelIcon from './../assets/excel.jpg';
import pptxIcon from './../assets/pptx.png';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from './constants';
function CommentAnswer() {
  const [newComment, setNewComment] = useState('');
  const route = useRoute();
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);      
  const { discussionId } = route.params
  const navigation = useNavigation();
  

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { id } = JSON.parse(userData);
          setUserId(parseInt(id));
        }
      } catch (error) {
       console.error(error)
      }
    };
  
    fetchUserId();
    
  }, []);  

    useEffect(()=>{
      const fetchData = async ()=>{
        try{
          const response = await axios.get(`${SERVER_IP}/api/discussion/${discussionId}/`);
          setComments(response.data.messages)
        }catch(err){
          console.log(err);
        }
      }    
      fetchData()
    },[newComment]);
    
    const handleGoBack = () => {
        try{
          navigation.goBack(); 
        }catch(err){
          console.error(err);
        }
    };
    const handleAddComment = async() =>{
      console.log('handle add comment...');
      try{ 
        const formData = new FormData();
        formData.append('sender', userId);
        formData.append('contenu', newComment);
        formData.append('discussion', discussionId);
        console.log('before axios....')
         await axios.post(`${SERVER_IP}/api/partage/comments/add/`,formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
         setNewComment('');
         Keyboard.dismiss()
      }catch(err){
        console.error(err);
      }
  };

  const updateCommentsLike = async (messageId) => {
    try{
      console.log(messageId)
      await axios.put(`${SERVER_IP}/api/discussion/messages/${messageId}/like/${userId}/`);
      setNewComment(' ');
      setNewComment('');
      print(userId)
    }catch(err){
      console.error(err)
    }
  };

    return (
        <View style={styles.containerComment}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>handleGoBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Retourner vers la publication</Text>
            </View>
            <ScrollView style={styles.commentSection}>
                {comments.map((comment, index) => (
                    <View key={index} style={[styles.comment,index !== 0 && styles.firstComment]}>
                        <Image source={{ uri: comment.sender['profile_url'] }} style={styles.personImage}></Image>
                        <Text style={styles.textComment}>{comment.contenu}</Text>
                        <View style={styles.reactions}>
                        <TouchableOpacity style={styles.reactionButton} onPress={() => updateCommentsLike(comment.id_message)}>
                          {comment.likes.includes(userId) ? (
                            <AntDesign name="like1" size={17} color="#27b0a0"></AntDesign>
                          ) : (
                            <AntDesign name="like1" size={17} color="#000000"></AntDesign>
                          )}
                          <Text>{comment.likes_number}</Text>
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.reactionButton} onPress={() => handleAddComment(comment.discussion)}>
                                <FontAwesome name='share' size={15}>{comment.reply}</FontAwesome>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.commentForm}>
                <TextInput
                style={styles.input}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Ajouter un commentaire"
                />
                
                <TouchableOpacity style={styles.commentReply}onPress={()=>handleAddComment()}>
                <Ionicons name="send" style={styles.icones} size={24} color="green" />
                </TouchableOpacity>
            </View>
        </View> 
        
    );
}


const styles = StyleSheet.create(
    {
        containerComment: {
            flex: 1,
            padding: 10,
            backgroundColor: '#fff', 
            paddingVertical: 30,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            marginBottom:7,
            width:'100%',
            
        },
        backButton: {
            marginRight: 10,
        },
        headerText: {
            fontSize: 16,
        },
        
        scrollView: {
            flexGrow: 1,
            alignItems: 'center',
          },
          
          personContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          },
          personImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
          },
          personName: {
            fontSize: 14,
          },
          
        
        profileContainer: {
          width: 40,
          height: 40,
          borderRadius: 20,
          overflow: 'hidden',
          marginRight: 10,
        },
        profileImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        
      personContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      personImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      personName: {
        fontSize: 14,
      },
      
      commentSection: {
        flex: 1,
        
      },
      firstComment: {
        marginLeft : 30,
        width: '92%'
        
        
    },
      comment: {
        padding: 10,
        borderWidth: 0.4,
        borderColor: 'white',
        borderRadius: 4,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        width:'100%'
      },
      commentForm: {
        flexDirection: 'row',
        alignItems: 'center',
        
      },
      reactions:{
        flexDirection: 'row',
        width: '20%',
        justifyContent: 'space-around',
      },
      textComment: {
        flexWrap: 'wrap',
        width: '60%',
      },
      input: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width:'99%',
        position:'absolute'
      },
      icones:{
        
      },
      reactionButton:{
        flexDirection: 'row',
      },
      commentReply:{
       
        left: 360
      }

    }
)

export default CommentAnswer;
