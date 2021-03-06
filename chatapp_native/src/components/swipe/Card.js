import React from 'react';
import { Dimensions, Animated } from 'react-native';
import styled from 'styled-components/native';

import LikeIcon from '../../assets/images/like.png';
import NopeIcon from '../../assets/images/nope.png';

const screenWidth = Dimensions.get('window').width;

const CardBlock = styled.View`
    position: relative;
    height: 500px;
    width: ${screenWidth}px;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 10px;
`;

const CardImageBlock = styled.Image`
    width: ${screenWidth-2}px;
    height: ${screenWidth-2}px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
`;

const CardTextFrameBlock = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const CardTextBlock = styled.Text`
    font-size: 15px;
`;

const TagImageBlock = styled.Image`
    width: 100px;
    height: 50px;
`;

const LeftTouchBlock = styled.TouchableWithoutFeedback``;

const LeftViewBlock = styled.View`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 50%;
    height: ${screenWidth-2}px;
`;

const RightTouchBlock = styled.TouchableWithoutFeedback``;

const RightViewBlock = styled.View`
    position: absolute;
    top: 0px;
    left: ${(screenWidth-2) / 2}px;
    width: 50%;
    height: ${screenWidth-2}px;
`;

const BarFrameBlock = styled.View`
    position: absolute;
    top: 5px;
    flex-direction: row;
    padding-left: 10px;
    padding-right: 10px;
`;

const BarBlock = styled.View`
    height: 5px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    z-index: 100;
    margin-right: 20px;
    width: 0px;
`;

const Card = ({
    item,
    uriIndex,
    uriLength,
    getRightTagStyle,
    getLeftTagStyle,
    onPressRight,
    onPressLeft,
}) => {
    const barBundle = [];
    const width = (screenWidth -2 - 20 - 10 * (uriLength-1)) / uriLength;
    if(uriLength > 1) {
        for(let i=0; i<uriLength; ++i) {
            if(i === uriIndex) {
                barBundle.push(
                    <BarBlock
                        key={`item.text_${i}`}
                        style={{ width, marginRight: i === uriLength-1 ? 0 : 10, backgroundColor: 'white' }}
                    />
                )
            } else {
                barBundle.push(
                    <BarBlock
                        key={`item.text_${i}`}
                        style={{ width, marginRight: i === uriLength-1 ? 0 : 10 }}
                    />
                )
            }
        }
    }

    return (
        <>
            <CardBlock>
                <CardImageBlock
                    source={{ uri: item.uri[uriIndex] }}
                />
                <BarFrameBlock>
                    {barBundle}
                </BarFrameBlock>
                {getRightTagStyle && getLeftTagStyle && (
                    <>      
                        <LeftTouchBlock onPress={onPressLeft}>
                            <LeftViewBlock />
                        </LeftTouchBlock>
                        <RightTouchBlock onPress={onPressRight}>
                            <RightViewBlock />
                        </RightTouchBlock>
                        <Animated.View style={[getRightTagStyle(), { position: 'absolute', top: 20, left: 10 }]}>
                            <TagImageBlock source={LikeIcon} style={{ transform: [{ rotate: '-20deg' }] }}/>
                        </Animated.View>
                        <Animated.View style={[getLeftTagStyle(), { position: 'absolute', top: 20, left:screenWidth-110}]}>
                            <TagImageBlock source={NopeIcon} style={{ transform: [{ rotate: '20deg' }] }}/>
                        </Animated.View>
                    </>
                )}
                <CardTextFrameBlock>
                    <CardTextBlock>
                        {item.text}
                    </CardTextBlock>
                </CardTextFrameBlock>
            </CardBlock>
        </>
    );
};

export default Card;