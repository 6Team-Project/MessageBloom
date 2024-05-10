import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PostCard from '../../components/post-id/post-card';
import { getMessages, getRecipient } from '../../apis/api';
import './PostId.scss';
import plusicon from '../../assets/icon/ic_plus.svg';
import loadingicon from '../../assets/icon/ic_loading.svg';
import settingicon from '../../assets/icon/ic_setting.svg';
import Modal from '../../components/post-id/postcard-modal';
import DeleteModal from '../../components/post-id/postcard-delete-modal';
import HeaderPost from '../../components/headerPost/HeaderPost';
import SearchInput from '../../components/post-id/search-input';
import PostDeleteModal from '../../components/post-id/post-delete-modal';
import ChangeBackModal from '../../components/post-id/ChangeBackModal';

function PostId() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [isSettingActive, setIsSettingActive] = useState(false);

  const [backgroundImg, setBackgroundImg] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  const [messagesData, setMessagesData] = useState([]);
  const [recipientData, setRecipientData] = useState([]);
  const [deleteDataId, setDeleteDataId] = useState('');
  const [modalData, setModalData] = useState([]);
  const [searchData, setSearchData] = useState([]);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const getInfosFromData = async (id) => {
    const [messages, recipient] = await Promise.all([getMessages(id), getRecipient(id)]);
    setMessagesData(messages);
    setRecipientData(recipient);
    setLoading(false);
  };

  // 마운트 시 실행 로직
  useEffect(() => {
    getInfosFromData(id);
  }, []);

  useEffect(() => {
    selectBackgroundTypeByData(recipientData);
  }, [recipientData]);

  // 모달 데이터 관리함수
  const setModalDataByData = (modalId) => {
    const [modalItem] = messagesData.filter((data) => data.id == modalId);
    setModalData(modalItem);
  };

  // 모달창 오픈용 boolean 상태값 관리 함수
  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };

  const handleDeleteModalOpen = (value) => {
    setIsDeleteModalOpen(value);
  };

  const handlePostDeleteModalOpen = (value) => {
    setIsPostDeleteModalOpen(value);
  };

  const handleChangeBackModalOpen = () => {
    setIsSettingActive(!isSettingActive);
  };

  // 배경화면 상태값 관리함수
  const selectBackgroundTypeByData = (recipientData) => {
    recipientData.backgroundImageURL === null
      ? setBackgroundColor(recipientData.backgroundColor)
      : setBackgroundImg(recipientData.backgroundImageURL);
  };

  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImg})`,
  };

  // 메세지 삭제 함수
  const handleDeleteMessage = (messageId) => {
    setMessagesData(messagesData.filter((data) => data.id !== messageId));
  };

  const handleDeleteDataId = (id) => {
    setDeleteDataId(id);
  };

  // 검색결과 반영 및 카테고리 관리 함수
  const setSearchInfo = (category, value) => {
    setFilteredData(category, value);
  };

  const setFilteredData = (category, value) => {
    const filteredData = messagesData.filter((data) => {
      if (category === '전체') return data.sender.includes(value) || data.content.includes(value);
      if (category === '이름') return data.sender.includes(value);
      if (category === '내용') return data.content.includes(value);
    });
    applyFilterToSearchData(filteredData);
  };

  const applyFilterToSearchData = (data) => {
    setSearchData(data);
  };

  return (
    <>
      {loading ? (
        <div className='loading-wrapper'>
          <img className='loading-wrapper__spinner' src={loadingicon} alt='로딩 중' />
        </div>
      ) : (
        <>
          <HeaderPost />
          <div className={`post-wrapper ${backgroundColor}`} style={backgroundImageStyle}>
            <SearchInput setSearchInfo={setSearchInfo} />
            <div className='post-edit-btn-container'>
              <Link to='/list' className='post-edit-btn-container__back-btn'>
                <span className='post-edit-btn-container__back-btn'>←뒤로가기</span>
              </Link>
              {isSettingActive && (
                <button
                  className='post-edit-btn-container__delete-btn'
                  onClick={handlePostDeleteModalOpen}>
                  포스트 삭제하기
                </button>
              )}
              <button
                className={`post-edit-btn-container__setting-btn ${isSettingActive && 'active'}`}
                onClick={handleChangeBackModalOpen}>
                <img
                  className='post-edit-btn-container__setting-btn-img'
                  src={settingicon}
                  alt='포스트 배경화면 설정 버튼'
                />
              </button>
            </div>
            <div className='posted-page-container'>
              <div className='add-post-card' onClick={() => navigate(`/post/${id}/message`)}>
                <div className='add-post-card__plus-icon'>
                  <img src={plusicon} alt='포스트 카드 추가 버튼' />
                </div>
              </div>
              {(searchData.length > 0 ? searchData : messagesData).map((data) => (
                <div key={data.id}>
                  <PostCard
                    data={data}
                    handleModalOpen={handleModalOpen}
                    handleDeleteDataId={handleDeleteDataId}
                    setModalDataByData={setModalDataByData}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                  />
                </div>
              ))}
              {isModalOpen && <Modal handleModalOpen={handleModalOpen} modalData={modalData} />}
              {isDeleteModalOpen && (
                <DeleteModal
                  handleDeleteMessage={handleDeleteMessage}
                  deleteDataId={deleteDataId}
                  handleDeleteModalOpen={handleDeleteModalOpen}
                />
              )}
              {isPostDeleteModalOpen && (
                <PostDeleteModal handlePostDeleteModalOpen={handlePostDeleteModalOpen} id={id} />
              )}
              {/* {isChangeBackModalOpen && (
                <ChangeBackModal handleChangeBackModalOpen={handleChangeBackModalOpen} id={id} />
              )} */}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default PostId;
