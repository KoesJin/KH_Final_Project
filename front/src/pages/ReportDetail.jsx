import React, { useState } from 'react';
import styled from 'styled-components';
import { Section } from '../styles/common/Container';
import { Button, ButtonText } from '../styles/common/Button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { reportService } from '../api/report';
import { toast } from 'react-toastify';
import useUserStatusStore from '../store/userStatusStore';

/*
  매칭상태에 따라 버튼변경해야함
    매칭중 : 수정, 삭제, 이전
    매칭종료 : 이전
*/

const ReportDetail = () => {
  const { reportNo } = useParams();
  const { userStatus } = useUserStatusStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState(true);
  const [report, setReport] = useState(location.state.report);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const result = await reportService.modifyReports(report);
      result && alert('일지가 수정되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error(error);
      const errorMessage = '일지를 불러오는데 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) {
      return;
    }
    try {
      const result = await reportService.removeReports(reportNo);
      result && alert('일지가 삭제되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error(error);
      const errorMessage = '일지를 삭제하는데 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (error) {
    return null;
  }

  return (
    <Wrap>
      <Head>
        <MainTitle>[{report.createDate.slice(0, 10)}]</MainTitle>
        <Buttons>
          {/*
            여기서 해당환자(patNo)의 간병인이 맞는지 체크해야함
            1. store에서 로그인No 가져와서 담당환자목록 가져오기
            2. {report.patNo && ( ... )} 걸어줘서 아래 수정 삭제 버튼 안보이게하기
            3. 매칭이 끝났으면 자기이름꺼만 가져오고 수정없애기
          */}

          {userStatus || (
            <>
              <Btn onClick={handleDelete}>
                <ButtonText>삭제</ButtonText>
              </Btn>
              <Btn onClick={() => setState(!state)}>
                {state ? <ButtonText>수정</ButtonText> : <ButtonText onClick={handleSubmit}>저장</ButtonText>}
              </Btn>
            </>
          )}

          <Btn onClick={() => window.history.back()}>
            <ButtonText>이전으로</ButtonText>
          </Btn>
        </Buttons>
      </Head>

      <Container>
        {state ? (
          <>
            <Title>{report.reportTitle}</Title>
            <br />
            <SubTitle>
              <Contents>{report.reportContent}</Contents>
            </SubTitle>
          </>
        ) : (
          <>
            <EditTitle
              maxRows={1}
              value={`${report.reportTitle}`}
              onChange={(e) => setReport({ ...report, reportTitle: e.target.value.replace('제목 : ', '') })}
            ></EditTitle>
            <br />

            <Edit
              maxRows={100}
              value={report.reportContent}
              onChange={(e) => setReport({ ...report, reportContent: e.target.value })}
            />
          </>
        )}
      </Container>
    </Wrap>
  );
};

const Wrap = styled.div`
  max-width: 950px;
  padding: ${({ theme }) => theme.spacing[8]} 0;
  margin: 0 auto;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing[8]};
`;
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
const Btn = styled(Button)`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 160px;
`;
const MainTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
`;

const Container = styled(Section)`
  box-shadow: ${({ theme }) => theme.shadows.base};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 16px;
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
`;

const SubTitle = styled.div`
  padding: 0 10px;
`;

const Contents = styled.pre`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  white-space: pre-wrap;
`;

const Edit = styled(TextareaAutosize)`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  width: 100%;
  resize: none;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
`;

const EditTitle = styled(TextareaAutosize)`
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  width: 100%;
  resize: none;
  box-sizing: border-box;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
`;
export default ReportDetail;
