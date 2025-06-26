import React, { useEffect, useState } from 'react';
import { Container, Section } from '../styles/common/Container';
import profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import chatImage from '../assets/icons/icon_채팅아이콘.png'; // 채팅 이미지 경로
import styled from 'styled-components';
import { SubmitButton } from '../styles/common/Button';
import { FaPlus } from 'react-icons/fa6';
import { media } from '../styles/MediaQueries';
import { useNavigate } from 'react-router-dom';
import { Input, InputGroup, Title } from '../styles/Auth.styles';
import useUserStore from '../store/userStore';
import { hiringService } from '../api/hiring';
import { useParams } from 'react-router-dom';
import { guardianHiringForm } from '../hooks/guardianHiringForm';
import ResumeSelectModal from '../components/ResumeSelectModal';
import { proposerSevice } from '../api/propose';

const HireDetail = () => {
  const navigate = useNavigate();
  const { hiringNo } = useParams();
  const { user } = useUserStore();
  const [jobOpening, setJobOpening] = useState();
  const [alreadyApplied, setAlreadyApplied] = useState(false); // 신청 여부 상태 추가

  const { register, handleSubmit, errors, isSubmitting, watch, setValue } = guardianHiringForm();

  const currentGender = watch('patGender');

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  //  신청 성공 시 상태 반영
  const handleApply = () => {
    setAlreadyApplied(true);
  };

  // 신청 취소 핸들러
  const handleCancel = async () => {
    const confirm = window.confirm('신청을 취소하시겠습니까?');
    if (!confirm) return;

    try {
      // 서버에 맞는 DELETE API 필요 (예: /proposer/{resumeNo}/{hiringNo})
      await proposerSevice.cancelProposer({
        caregiverNo: user.userNo,
        hiringNo: Number(hiringNo),
      });
      alert('신청이 취소되었습니다.');
      setAlreadyApplied(false);
    } catch (err) {
      alert('신청 취소 실패');
      console.error(err);
    }
  };
  useEffect(() => {
    const init = async () => {
      try {
        const data = await hiringService.getHirngById(Number(hiringNo), user.userNo); // userNo 전달
        console.log(data);
        setJobOpening(data);

        // 신청 여부는 API에서 받으니 따로 호출하지 않아도 됨
        setAlreadyApplied(data.applied);
        // 폼 필드 초기화
        setValue('hiring_title', data.hiringTitle);
        setValue('hiringContent', data.hiringContent);
        setValue('account', data.account);
        setValue('startDate', data.startDate.slice(0, 10)); // yyyy-MM-dd 형식
        setValue('endDate', data.endDate.slice(0, 10));
        setValue('maxApplicants', data.maxApplicants);
        setValue('careStatus', data.careStatus);
        setValue('patGender', data.patGender); // 성별도 설정
      } catch (error) {
        console.error('구인글 상세 및 신청 상태 불러오기 실패', error);
      }
    };

    if (user?.userNo && hiringNo) {
      init();
    }
  }, [user, hiringNo, setValue]);
  return (
    <HireRegistSection>
      <HireContainer>
        <HireHead>
          <HireHeadTitle>돌봄대상자 정보</HireHeadTitle>
        </HireHead>
        <form>
          <ContentWrapper>
            <div>
              <ProfilImageWrapper>
                <img src={jobOpening?.profileImage} alt="프로필 이미지" />
              </ProfilImageWrapper>
              <ChatButton>
                <img src={chatImage} alt="프로필 이미지" />1 : 1 채팅하기
              </ChatButton>
            </div>
            <Divider>
              <InputRow>
                <InputGroup>
                  <Label>이름</Label>
                  <Input type="text" id="patName" value={jobOpening?.patName} readOnly />
                </InputGroup>
                <InputGroup>
                  <Label>나이</Label>
                  <Input type="text" id="age" value={jobOpening?.patAge} readOnly />
                </InputGroup>
              </InputRow>
              <RadioGroup>
                <Label>성별</Label>
                <RadioWrapper checked={currentGender === 'M'}>
                  <input type="radio" id="M" name="patGender" value="M" checked={currentGender === 'M'} readOnly />
                  <label htmlFor="M">남성</label>
                </RadioWrapper>
                <RadioWrapper checked={currentGender === 'F'}>
                  <input type="radio" id="F" name="patGender" value="F" checked={currentGender === 'F'} readOnly />
                  <label htmlFor="F">여성</label>
                </RadioWrapper>
              </RadioGroup>
              <InputGroup>
                <Label>보호자 전화번호</Label>
                <Input type="text" value={jobOpening?.phone} readOnly />
              </InputGroup>
              <InputGroup>
                <Label>주소</Label>
                <Input type="text" id="patAddress" value={jobOpening?.patAddress} readOnly />
              </InputGroup>
              <InputRow>
                <InputGroup>
                  <Label>키</Label>
                  <Input type="text" value={jobOpening?.patHeight} readOnly />
                </InputGroup>
                <InputGroup>
                  <Label>몸무게</Label>
                  <Input type="text" value={jobOpening?.patWeight} readOnly />
                </InputGroup>
              </InputRow>
            </Divider>
          </ContentWrapper>
          <ContentWrapper>
            <DiseaseGroup>
              <Label>보유한 질병</Label>
              <DiseaseInputDiv>
                {jobOpening?.diseaseTag?.map((tag, idx) => (
                  <div key={idx}>{tag}</div>
                ))}
              </DiseaseInputDiv>
            </DiseaseGroup>
          </ContentWrapper>
          <HireBottom>
            <HireBottomTitle>채용 정보</HireBottomTitle>
          </HireBottom>
          <ContentWrapper1>
            <HireContent>
              <Label>제목</Label>
              <Input type="text" id="hiring_title" {...register('hiring_title')} />
              <InputRow>
                <InputGroup>
                  <Label>지급 금액 (시급)</Label>
                  <Input type="text" id="account" {...register('account')} />
                </InputGroup>
                <InputGroup>
                  <Label>시작일</Label>
                  <Input type="date" id="startDate" {...register('startDate')} />
                </InputGroup>

                <InputGroup>
                  <Label>종료일</Label>
                  <Input type="date" id="endDate" {...register('endDate')} />
                </InputGroup>
                <InputGroup>
                  <Label>모집 인원수 설정</Label>
                  <Input type="number" id="maxApplicants" {...register('maxApplicants')} />
                </InputGroup>
              </InputRow>
              <Label>내용</Label>
              <Content type="text" id="hiringContent" {...register('hiringContent')} />
              <RadioGroup>
                <Label>숙식 제공 여부</Label>
                <RadioWrapper>
                  <input type="radio" value="Y" name="careStatus" checked={jobOpening?.careStatus === 'Y'} readOnly />
                  <label>가능</label>
                </RadioWrapper>
                <RadioWrapper>
                  <input type="radio" value="N" name="careStatus" checked={jobOpening?.careStatus === 'N'} readOnly />
                  <label>불가능</label>
                </RadioWrapper>
              </RadioGroup>
              <InputGroup>
                <Label>숙소 정보</Label>
                {/* 클릭 가능한 div */}
                <RoomImage>
                  <Plus />
                </RoomImage>
                <input type="file" style={{ display: 'none' }} />
              </InputGroup>
            </HireContent>
          </ContentWrapper1>
        </form>

        <ButtonGroup>
          <BackButton onClick={() => navigate(-1)}>이전</BackButton>

          {alreadyApplied ? (
            <SubmitButton1 type="button" onClick={handleCancel}>
              신청취소
            </SubmitButton1>
          ) : (
            <SubmitButton1 type="button" onClick={handleOpenModal}>
              신청하기
            </SubmitButton1>
          )}

          {isModalOpen && (
            <ResumeSelectModal
              hiringNo={hiringNo}
              onClose={handleCloseModal}
              onSuccess={(resumeNo) => {
                handleApply();
                setModalOpen(false);
              }}
            />
          )}
        </ButtonGroup>
      </HireContainer>
    </HireRegistSection>
  );
};

const HireRegistSection = styled(Section)``;

const HireContainer = styled(Container)`
  width: 80%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden; /* 내부 요소가 넘치지 않도록 */
`;

const HireHead = styled.div`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[5]};
  margin-top: 10px;
`;

const HireHeadTitle = styled(Title)`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
`;

const ChatButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-top: ${({ theme }) => theme.spacing[6]};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  img {
    width: 33px;
    height: 33px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  padding: ${({ theme }) => theme.spacing[6]}; /* 전체 패딩 */
  gap: ${({ theme }) => theme.spacing[6]}; /* 이미지와 입력 필드 그룹 사이 간격 */
  justify-content: space-around;
  ${media.md`
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing[8]}; /* 큰 화면에서 패딩 증가 */
    gap: ${({ theme }) => theme.spacing[10]}; /* 큰 화면에서 간격 증가 */
  `}
`;

const ProfilImageWrapper = styled.div`
  flex-shrink: 0; /* 줄어들지 않도록 */
  width: 150px; /* 고정 너비 */
  height: 150px; /* 고정 높이 */
  border-radius: 50%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[100]}; /* 이미지 없을 때 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center; /* 세로 중앙 정렬 */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${media.md`
    width: 200px;
    height: 200px;
    align-self: flex-start; /* 큰 화면에서는 상단 정렬 */
  `}
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};

  ${media.md`
    
    flex-direction: row;
  `}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-align: left;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  // 'checked' prop을 받아서 스타일을 동적으로 적용합니다.
  input[type='radio'] {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease-in-out;
    background-color: white;
    // RadioWrapper에서 전달받은 checked prop 사용
    border: 1px solid ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.gray[4])};
  }

  input[type='radio']::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease-in-out;
  }

  input[type='radio']:checked::before {
    transform: translate(-50%, -50%) scale(1);
  }

  label {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.gray[1]};
    cursor: pointer;
  }
`;

const Divider = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const DiseaseGroup = styled(InputGroup)`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing[16]};

  input {
    width: 100%;
    border: none;
  }
`;
const DiseaseInputDiv = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: 55px;
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: 0 ${({ theme }) => theme.spacing[10]};
  text-align: center;
  align-items: center;
  max-width: 800px;
  div {
    width: 80px;
    height: 32px;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.gray[5]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    color: white;
  }
`;
const HireBottom = styled.div`
  width: 100%;
  display: flex;
  padding: 0 ${({ theme }) => theme.spacing[20]};
`;
const HireBottomTitle = styled(Title)`
  margin: 0;
`;

const HireContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ContentWrapper1 = styled.div`
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  padding: ${({ theme }) => theme.spacing[6]}; /* 전체 패딩 */
  gap: ${({ theme }) => theme.spacing[6]}; /* 이미지와 입력 필드 그룹 사이 간격 */
  justify-content: space-around;
  ${media.md`
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing[6]}; /* 큰 화면에서 패딩 증가 */
    gap: ${({ theme }) => theme.spacing[10]}; /* 큰 화면에서 간격 증가 */
  `}
`;

const Content = styled.textarea`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  min-height: 400px; /* 원하는 기본 높이 */
  resize: none;
  overflow: hidden; /* 스크롤 숨김 */
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const RoomImage = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  width: 50%;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: 'pointer';
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  padding: 64px;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: center;
`;

const BackButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const SubmitButton1 = styled(SubmitButton)`
  width: 65%;
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: white;
`;

const Plus = styled(FaPlus)`
  width: 30px;
  height: 30px;
  color: white;
`;
export default HireDetail;
