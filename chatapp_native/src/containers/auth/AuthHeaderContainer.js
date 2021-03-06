import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../components/common/Header';
import { clearAll as clearBaseValue } from '../../modules/base';
import { clearAll as clearImageValue } from '../../modules/image';
import { clearAll as clearProfileValue } from '../../modules/profile';
import { clearAll as clearVerifyValue } from '../../modules/verify';

const AuthHeaderContainer = ({ left, center, right, leftNav, rightNav, navigation, ...rest }) => {
    const { modal } = useSelector(({ modal }) => ({
        modal: modal.modal,
    }));

    const dispatch = useDispatch();

    const onPressLeft = useCallback(() => {
        Alert.alert(
            '회원 가입 취소',
            '입력하신 내용은 모두 초기화됩니다',
            [
                {
                    text: '계속하기',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'default',
                },
                {
                    text: '가입취소',
                    onPress: () => {
                        navigation.navigate(leftNav);
                        dispatch(clearBaseValue());
                        dispatch(clearVerifyValue());
                        dispatch(clearImageValue());
                        dispatch(clearProfileValue());
                    },
                    style: 'default',
                },
            ],
            {cancelable: false},
          );
    }, [dispatch, navigation, leftNav]);

    const onPressRight = useCallback(() => {
        navigation.navigate(rightNav);
    }, [navigation, rightNav]);
    
    return (
        <Header
            left={left}
            center={center}
            right={right}
            onPressLeft={onPressLeft}
            onPressRight={onPressRight}
            modal={modal}
        />
    );
};

export default AuthHeaderContainer;
