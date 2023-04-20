import React from 'react';
import { FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../firebase';
import moment from 'moment';

import {
  Container,
  Card,
  UserInfo,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
  RolesWrapper,
  UserNameAndCategory,
} from '../styles/FeedStyles';

import RoleDisplay from './RoleDisplay';

const PostCard = ({item, onDelete}) => {
  likeIcon = item.liked ? 'heart' : 'heart-outline';
  likeIconColor = item.liked ? '#2e64e5' : '#333';

  if (item.likes == 1) {
    likeText = '1 Like';
  } else if (item.likes > 1) {
    likeText = item.likes + ' Likes';
  } else {
    likeText = 'Like';
  }

  if (item.comments == 1) {
    commentText = '1 Comment';
  } else if (item.comments > 1) {
    commentText = item.comments + ' Comments';
  } else {
    commentText = 'Comment';
  }

  return (
    <Card>
        <UserInfo>
            <UserInfoText>
                <UserName>{item.userName}</UserName>
                {item.postTime && <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>}
            </UserInfoText>
        </UserInfo>
        
        <PostText>{item.post}</PostText>
        {item.postImg != null ? <PostImg source={{uri: item.postImg}} /> : <Divider />}
        <RolesWrapper>
          <FlatList
              data={item.roleDisplays}
              renderItem={({item, index}) => <RoleDisplay key={index} item={item} size={{size: "0"}} />}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
          />
        </RolesWrapper>


      <InteractionWrapper>
        <Interaction active={item.liked}>
          <Ionicons name={likeIcon} size={25} color={likeIconColor} />
          <InteractionText active={item.liked}>{likeText}</InteractionText>
        </Interaction>
        <Interaction>
          <Ionicons name="md-chatbubble-outline" size={25} />
          <InteractionText>{commentText}</InteractionText>
        </Interaction>

        {auth.currentUser.uid==item.userId ?
          <Interaction onPress={()=>{onDelete(item.id)}}>
            <Ionicons name="md-trash-bin" size={25} />
          </Interaction>
        : null}



      </InteractionWrapper>
    </Card>
  );
};

export default PostCard;