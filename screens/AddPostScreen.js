import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { storage, ref, firestore, auth } from '../firebase';
import { uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, getDocs, query } from "firebase/firestore"; 




import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../styles/AddPostStyles';

import MultiSelect from 'react-native-multiple-select';


const AddPostScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const storageRef = ref(storage);
  const imagesRef = ref(storageRef, 'posts', 'images');
  const [post, setPost] = useState(null);

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };
  

  const takePhotoFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    
    
  };
  
  const choosePhotoFromLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    
    
  };

  const [roleItems, setRoleItems] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);


  const fetchRoles = async () => {
    const rolesRef = collection(firestore, 'roles');
    const roleSnapshot = await getDocs(rolesRef);
    const rolesArray = roleSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        emoji: data.emoji,
        advisors: data.advisors,
        students: data.students,
      };
    });
    setRoleItems(rolesArray);
  };
  
  useEffect(() => {
    fetchRoles();
  }, []);
  
  const submitPost = async () => {

    if (post.length != 0) {
      const imageURL = await uploadImage();
      console.log('Image URL: ', imageURL);
      console.log("user id: ", auth.currentUser.uid)
      console.log("role displays: ", selectedRoles)
      console.log("user id: ", auth.currentUser.uid)

      console.log('Roles right before adding to Firestore:', selectedRoles);
      const docRef = await addDoc(collection(firestore, 'posts'), {
        userId: auth.currentUser.uid,
        postTime: serverTimestamp(),
        post: post,
        postImg: imageURL,
        likes: null,
        comments: null,
        roleDisplays: selectedRoles,
      })
      .then(() => {
        if(post!==null){
          console.log('Post Added!');
          Alert.alert(
            'Post Published!',
            'Your post has been published Successfully!',
          );
        }
        setPost(null);
      })
      .catch((error)=> {
        console.log('Something went wrong with added post to firestore!');
      })
    }
  }
  


  const uploadImage = async () => {
    if(image==null){
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const filePath = "posts/images/"+filename;
    console.log("defining blob with uri ", {uploadUri});
    const blob = await uriToBlob(uploadUri);
    console.log("defining storageRef with filepath ", {filePath});
    const storageRef = ref(storage, filePath);
    console.log("defining task constant with storage ref ",{storageRef}," and blob ",{blob});
    const task = uploadBytesResumable(storageRef, blob);
    
    // Set transferred state
    task.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(snapshot.bytesTransferred,' out of ',snapshot.totalBytes,' transfered');
  
        setTransferred(
          Math.round(progress),
        );
      },
      (error) => console.log(error),
      () => {
        // Handle successful uploads on complete
        setUploading(false);
        Alert.alert(
          'Image uploaded!',
          'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
        );
        setImage(null);
      },
    );

    try {
      await task;

      const url = await getDownloadURL(storageRef);

      setUploading(false);


      return url; 

    } catch (e) {
      console.log(e);
      return null;
    }

    setImage(null);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <InputWrapper>
          {image != null ? <AddImage source={{uri: image}} /> : null}

          <InputField
            placeholder="Enter post message"
            value={post}
            multiline= {true}
            numberOfLines={4}
            onChangeText={(content)=> setPost(content)}
            maxHeight= '40%'
          />

          <MultiSelect
            items={roleItems}
            uniqueKey="id"
            onSelectedItemsChange={(selectedIds) =>
              setSelectedRoles(
                roleItems.filter((role) => selectedIds.includes(role.id))
              )
            }
            selectedItems={selectedRoles ? selectedRoles.map((role) => role.id) : []}
            selectText="Select Roles"
            searchInputPlaceholderText="Search Roles..."
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            searchInputStyle={{color: '#CCC'}}
            submitButtonColor="#2e64e5"
            submitButtonText="Submit"
            styleMainWrapper={{ minWidth: '50%', marginBottom: 10 }}
            styleDropdownMenu={{ minWidth: '50%' }}
            styleListContainer={{ maxHeight: 200 }}
            styleTextDropdown={{ fontSize: 16 }}
            styleTextDropdownSelected={{ fontSize: 16 }}
          />

          {uploading ? (
            <StatusWrapper>
              <Text>{transferred}% Completed!</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </StatusWrapper>
          ) : (
            <SubmitBtn onPress={submitPost}>
              <SubmitBtnText>Post</SubmitBtnText>
            </SubmitBtn>

          )}
        </InputWrapper>
          <ActionButton buttonColor="#2e64e5">
          <ActionButton.Item
              buttonColor="#9b59b6"
              title="Take Photo"
              onPress={takePhotoFromCamera}>
              <Icon name="camera-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
              buttonColor="#3498db"
              title="Choose Photo"
              onPress={choosePhotoFromLibrary}>
              <Icon name="md-images-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          </ActionButton>
      </View>
      </TouchableWithoutFeedback>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});