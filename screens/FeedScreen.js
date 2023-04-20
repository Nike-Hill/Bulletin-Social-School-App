import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList,  Alert,} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {auth, firestore, storage, ref } from '../firebase';
import {  deleteObject} from "firebase/storage";
import { where } from 'firebase/firestore';
import { collection, 
        doc, 
        getDocs, 
        getDoc, 
        deleteDoc,
        onSnapshot, 
        orderBy, 
        query, 
        limit} 
        from 'firebase/firestore';


import PostCard from '../components/PostCard';

import {
  Container,
} from '../styles/FeedStyles';





const RoleDisplays = [
    {
        emoji: '🏀',
        name: 'Varsity Boys Basketball',
    },

    {
        emoji: '💼',
        name: 'FBLA',
    },

    {
        emoji: '🎭',
        name: 'Theater',
    },

    {
      emoji: '🤖',
      name: 'Robotics',
    },

    {
      emoji: '⚽',
      name: 'Girls Soccer',
    },

    {
      emoji: '💻',
      name: 'Coding Club',
    },
]



const FeedScreen = () => {

    const[posts, setPosts] = useState(null)
    const[loading, setLoading] = useState(true)
    const[deleted, setDeleted] = useState(false)


 //...

const fetchUserName = async (userId) => {
  let userName = '';

  const usersCollection = collection(firestore, "users");
  const usersQuery = query(usersCollection);

  const querySnapshot = await getDocs(usersQuery);
  querySnapshot.forEach((doc) => {
    console.log("userId recieved: ", userId);
    console.log("current userId: ", doc.get("uid"));
    if(doc.get("uid")==userId){
      userName = `${doc.get("first")} ${doc.get("last")}`;
    }
  });

  return userName;
};

  
const fetchPosts = () => {
  const postsCollection = collection(firestore, "posts");
  const postsQuery = query(postsCollection, orderBy("postTime", "desc"));

  const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
    const fetchedPostsPromises = querySnapshot.docs.map(async (doc) => {
      const userName = await fetchUserName(doc.get("userId"));
      return {
        id: doc.id,
        userId: doc.get("userId"),
        userName: userName,
        postTime: doc.get("postTime"),
        post: doc.get("post"),
        postImg: doc.get("postImg"),
        liked: true,
        likes: "14",
        comments: "5",
        roleDisplays: doc.get("roleDisplays"),
      };
    });

    Promise.all(fetchedPostsPromises).then((fetchedPosts) => {
      setPosts(fetchedPosts);

      if (loading) {
        setLoading(false);
      }
      console.log("Posts: ", fetchedPosts);
    });
  });

  return unsubscribe;
};

//...

    

    useEffect(() => {
      const unsubscribe = fetchPosts();
      return () => {
        unsubscribe();
      };
    }, []);
    
    const handleDelete = (postId) => {
      Alert.alert(
        'Delete post',
        'Are you sure you want to delete this post?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },

          {
            text: 'Confirm',
            onPress: () => deletePost(postId),
          },

        ],

        {cancelable: false}
      );
    }

    const deletePost = async (postId) => {
      console.log('Current Post Id: ', postId)
      const docRef = doc(firestore, "posts", postId)
      docSnap = await getDoc(docRef)
      console.log('Current doc snapshot: ', docSnap)
      if(docSnap){
        console.log(`Post image:  ${docSnap.get("postImg")}`)
        if(docSnap.get("postImg")!=null){
          const imageRef = ref(storage, docSnap.get("postImg"));
          console.log('Image reference: ', imageRef);
          deleteObject(imageRef)
          .then(()=>{
            console.log(`${docSnap.get("postImg")} has been deleted successfully.`)
            deleteFirstoreData(postId);
          })
          .catch((e)=> {
            console.log('Error while deleting the image: ', e);
          })
        //delete post without image
        } else {
          deleteFirstoreData(postId);
        }
      }
    }

    const deleteFirstoreData = (postId) => {
      deleteDoc(doc(firestore, "posts", postId));
      Alert.alert('Post deleted!');
      setDeleted(true);
    }
    
    return (
        <Container>
            <Text>Hey {':)'}</Text>
            <FlatList
                data={posts}
                renderItem={({item}) => <PostCard item={item} onDelete={handleDelete}/>}
                keyExtractor={item => item.index}
                showsVerticalScrollIndicator={false}
            />
        </Container>

    );
    
};
  
export default FeedScreen;