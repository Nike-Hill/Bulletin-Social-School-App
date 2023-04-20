import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Button, Alert } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where, addDoc, updateDoc } from 'firebase/firestore';
import RoleDisplay from '../components/RoleDisplay';
import MultiSelect from 'react-native-multiple-select';
import emojiRegex from 'emoji-regex';


const HomeScreen = ({navigation}) => {

    const handleSignOut = () => {
        auth
            .signOut()
            .then(()=> {
              navigation.replace("Login")
            })
            .catch(error=>alert(error.message))
    }

    
    const [user,setUser] = useState(null)
    const[users, setUsers] = useState([])
  
    // Fetch the current user's data
    useEffect(() => {
      const fetchUser = async () => {
        const userQuery = query(collection(firestore, "users"), where("uid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.get("first")} ${doc.get("last")}`);
        });
    
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const fetchedUser = {
                id: doc.id,
                values: {
                    first: doc.get("first"),
                    last: doc.get("last"),
                    accountType: doc.get("accountType"),
                    id: doc.get("uid"),
                    email: doc.get("email"),
                },
            };
    
            setUser(fetchedUser);
            console.log("accountType: ", user?.values.accountType)
        }
    };
        
      fetchUser();
    }, []);
      
    
    useEffect(() => {
        if (user) {
            const fetchUsers = async () => {
                const querySnapshot = await getDocs(collection(firestore, "users"), where("accountType", "!=", user?.values.accountType));
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} => ${doc.get("first")} ${doc.get("last")}`);
                });

                const fetchedUsers = [];
                querySnapshot.forEach((doc) => {
                    fetchedUsers.push({ id: doc.id, values: {
                        first: doc.get("first"),   
                        last: doc.get("last"),
                        accountType: doc.get("accountType"),
                        id: doc.get("uid"),
                        email: doc.get("email"),
                    }});
                });

                setUsers(fetchedUsers);
            };

            fetchUsers();
        }
    }, [user]);
    
    const [roles, setRoles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [roleEmoji, setRoleEmoji] = useState('');
    const [roleStudents, setRoleStudents] = useState([]);
    const [roleAdvisors, setRoleAdvisors] = useState([]);
    const[refresh, setRefresh] = useState(false);
  
    const fetchRoles = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'roles'));
      const fetchedRoles = [];
      querySnapshot.forEach((doc) => {
        fetchedRoles.push({ id: doc.id, ...doc.data() });
      });

      setRoles(fetchedRoles);
    };

    useEffect(() => {
      if (user) {
        // Fetch roles only if the user is an admin
        if (user.values.accountType === 'Admin') {
          console.log('Account type is admin');

  
          fetchRoles();
          setRefresh(false);
        }
      }
    }, [user, refresh]);
  

    const [students, setStudents] = useState([]);
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const querySnapshot = await getDocs(collection(firestore, "users"));
            const fetchedStudents = [];
            querySnapshot.forEach((doc) => {
              if(doc.get("accountType")=="Student"){
                fetchedStudents.push({ id: doc.id, values: {
                  first: doc.get("first"),   
                  last: doc.get("last"),
                  accountType: doc.get("accountType"),
                  id: doc.get("uid"),
                  email: doc.get("email"),
              }});
              }

            });

            setStudents(fetchedStudents);
        };

        const fetchStaff = async () => {
            const querySnapshot = await getDocs(collection(firestore, "users"));
            const fetchedStaff = [];
            querySnapshot.forEach((doc) => {
              if(doc.get("accountType")=="Staff"){
                fetchedStaff.push({ id: doc.id, values: {
                  first: doc.get("first"),   
                  last: doc.get("last"),
                  accountType: doc.get("accountType"),
                  id: doc.get("uid"),
                  email: doc.get("email"),
              }});
              }
            });

            setStaff(fetchedStaff);
        };

        fetchStudents();
        fetchStaff();
    }, []);

    const handleAddRole = async () => {
      if (roleName.length > 0 && roleEmoji.length > 0 && roleStudents.length > 0 && roleAdvisors.length > 0) {
        const newRoleRef = await addDoc(collection(firestore, 'roles'), {
          name: roleName,
          emoji: roleEmoji,
          students: roleStudents,
          advisors: roleAdvisors,
        });
    
        // Function to update user roles
        const updateUserRoles = async (userIds, roleId) => {
          userIds.forEach(async (userId) => {
            const userRef = doc(firestore, 'users', userId);
            const userDoc = await getDoc(userRef);
    
            if (userDoc.exists()) {
              const userRoles = userDoc.get('roles') || [];
              userRoles.push(roleId);
    
              await updateDoc(userRef, { roles: userRoles });
            }
          });
        };
    
        // Update students and advisors with the new role
        await updateUserRoles(roleStudents, newRoleRef.id);
        await updateUserRoles(roleAdvisors, newRoleRef.id);
        
        setRoleName('');
        setRoleEmoji('');
        setRoleStudents([]);
        setRoleAdvisors([]);
        setModalVisible(false);
        setRefresh(true);
        fetchRoles();
      } else {
        Alert.alert('Please fill out all fields');
      }
    };
  
    const renderItem = ({ item }) => {
      return (
        <View style={styles.listItem}>
          <Text>{item.values.first} {item.values.last}</Text>
          <Text>accountType: {item.values.accountType}</Text>
        </View>
      );
    };
  
    const renderRole = ({ item }) => {
      return (
        <View style={styles.listItem}>
          <RoleDisplay item={item} size={{size: "1"}} />
        </View>
      );
    };

    const handleEmojiInputChange = (text) => {
      const emojiMatch = text.match(emojiRegex());
      const isEmoji = emojiMatch && emojiMatch[0] === text;
    
      if (isEmoji || text === '') {
        setRoleEmoji(text);
      }
    };
    
    
      return (
        <View style={styles.container}>
          <Text marginTop={30} >Hello {user?.values?.first}!</Text>
          <Text>Email: {auth.currentUser?.email}</Text>

          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
          
          
          {user?.values?.accountType === 'Admin' && (
            <>
                            <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  marginBottom: 20,
                }}
              >
                Here is the list of roles:
              </Text>
              <View style={{ marginBottom: 10 }}>
                <FlatList
                  data={roles}
                  renderItem={renderRole}
                  keyExtractor={(item) => item.id}
                  maxHeight='70%'
                  minWidth='90%'
                  showsVerticalScrollIndicator={false}
                />
              </View>

              
              <Button title="Add Role" onPress={() => setModalVisible(true)} />
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Add Role</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={setRoleName}
                      value={roleName}
                      placeholder="Role Name: "
                      placeholderTextColor='#9c9c9c'
                    />

                    <TextInput
                      style={styles.input}
                      onChangeText={(text)=>handleEmojiInputChange(text)}
                      value={roleEmoji}
                      placeholder="Role Emoji"
                      placeholderTextColor='#9c9c9c'
                    />

                    
                    <MultiSelect
                      items={students.map((student) => ({
                        ...student,
                        displayName: `${student.values.first} ${student.values.last}`,
                      }))}                      
                      uniqueKey="id"
                      onSelectedItemsChange={setRoleStudents}
                      selectedItems={roleStudents}
                      selectText="Select Students"
                      searchInputPlaceholderText="Search Students..."
                      tagRemoveIconColor="#CCC"
                      tagBorderColor="#CCC"
                      tagTextColor="#CCC"
                      selectedItemTextColor="#CCC"
                      selectedItemIconColor="#CCC"
                      itemTextColor="#000"
                      displayKey="displayName"
                      searchInputStyle={{ color: '#CCC' }}
                      submitButtonColor="#0782F9"
                      submitButtonText="Select"
                      styleMainWrapper={{ minWidth: '90%', marginBottom: 10 }}
                      styleDropdownMenu={{ minWidth: '100%' }}
                      styleListContainer={{ maxHeight: 200 }}
                      styleTextDropdown={{ fontSize: 16 }}
                      styleTextDropdownSelected={{ fontSize: 16 }}
                    />

                    <MultiSelect
                      items={staff.map((stf) => ({
                        ...stf,
                        displayName: `${stf.values.first} ${stf.values.last}`,
                      }))}
                      uniqueKey="id"
                      onSelectedItemsChange={setRoleAdvisors}
                      selectedItems={roleAdvisors}
                      selectText="Select Staff"
                      searchInputPlaceholderText="Search Staff..."
                      tagRemoveIconColor="#CCC"
                      tagBorderColor="#CCC"
                      tagTextColor="#CCC"
                      selectedItemTextColor="#CCC"
                      selectedItemIconColor="#CCC"
                      itemTextColor="#000"
                      displayKey="displayName"
                      searchInputStyle={{ color: '#CCC' }}
                      submitButtonColor="#0782F9"
                      submitButtonText="Select"
                      styleMainWrapper={{ minWidth: '90%', marginBottom: 10 }}
                      styleDropdownMenu={{ minWidth: '100%' }}
                      styleListContainer={{ maxHeight: 200 }}
                      styleTextDropdown={{ fontSize: 16 }}
                      styleTextDropdownSelected={{ fontSize: 16 }}
                    />


                    <Button title="Add Role" onPress={handleAddRole} />
                    <Button
                      title="Cancel"
                      color="red"
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                </View>
              </Modal>
            </>
          )}
                    

                    
        </View>
    )

}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop:50,
      },
      
    button: {
        width: '60%',
        alignItems: 'center',
        backgroundColor: '#0782F9',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        marginTop: 40,
      },
    
 
    
      buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
      },
    
    
      listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
      },
      input: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 10,
      },
      
      
});