import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../components/common/Modal';

//  상위에서 modal이 변경되면 한번, useSelector 내부의 profile이 변경되면서 다시 한번 변경되서 두번의 렌더링이 일어남
//  React.memo로 막는 방법도 있지만 useSelector에서 profile 가져오지 않고 리듀서를 분리함으로써 이 문제를 해결할 수 있음
const ModalContainer = () => {
    const {  modalType, modalObject } = useSelector(({ modal }) => ({
        modalType: modal.modalType,
        modalObject: modal.modalObject,
    }));

    const modalArr = modalObject[modalType];
    console.log(modalType);

    return (
        <Modal
            modalArr={modalArr}
        />
    );
};

export default ModalContainer;