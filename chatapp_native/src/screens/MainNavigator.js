import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './home/HomeScreen';
import TalkScreen from './talk/TalkScreen';
import LikeScreen from './like/LikeScreen';
import ChatNavigator from './ChatNavigator';
import SettingScreen from './setting/SettingScreen';

const Tab = createBottomTabNavigator();
const MainNavigator = () => (
  <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen}/>
      <Tab.Screen name='Talk' component={TalkScreen}/>
      <Tab.Screen name='Like' component={LikeScreen}/>
      <Tab.Screen
        name='ChatNav'
        component={ChatNavigator}
        
      />
      <Tab.Screen name='Setting' component={SettingScreen}/>
  </Tab.Navigator>
)

export default MainNavigator;