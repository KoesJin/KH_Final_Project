import React, { useEffect, useState } from 'react';
import { Section } from '../styles/common/Container';
import styled from 'styled-components';
import { BoardItemTop, BoardTop, BorderDiv, Button, Left, Right, SearchBoard } from '../styles/common/Board';
import { reportService } from '../api/report';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ButtonText, SubmitButton } from '../styles/common/Button';
import { patientService } from '../api/patient';
import useUserStatusStore from '../store/userStatusStore';
import { useLocation } from 'react-router-dom';
import useUserStore from '../store/userStore';

const ReportMain = () => {
  const { patNo } = useParams(); // URL의 :patNo 값 가져오기
  const [pat, setpat] = useState({}); //환자들
  const [allReport, setAllReport] = useState([]); // 처음 가져온 전체 일지 목록
  const [dateFilter, setDateFilter] = useState(''); // 날짜 필터
  const [authorFilter, setAuthorFilter] = useState(''); // 작성자 필터
  const [reportList, setReportList] = useState([]); // 필터링 후 일지목록
  const { userStatus } = useUserStatusStore();
  const [error, setError] = useState(null);
  const { user } = useUserStore();
  const navigate = useNavigate();

  // 일지목록에서 가져온, 드롭다운박스에 넣을 날짜들과 작성자들
  const uniqueDates = [...new Set(allReport.map((report) => report.createDate.slice(0, 10)))];
  const uniqueAuthors = [...new Set(allReport.map((report) => report.userName))];
  const location = useLocation();
  const status = location.state?.status;

  const formatPhoneNumber = (phone = '') => {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  //  const statusMatching = async () =>  {
  //   try{
  //       const status = await matchingService.findStatus(matNo)

  //   }catch(error){
  // console.log(error)
  //   }
  //  }

  useEffect(() => {
    // 로그인하지 않은 경우 이전 페이지로 이동
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate(-1);
      return;
    }

    const patient = async () => {
      try {
        const patient = await patientService.getPatientId(patNo);
        setpat(patient);
      } catch (error) {
        console.error(error);
        const errorMessage = '돌봄 대상자를 불러오는데 실패했습니다.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };
    const loadReportList = async () => {
      try {
        const reports = await reportService.getReports(patNo);

        if (reports) {
          setAllReport(reports);

          setReportList(
            reports.filter((report) => {
              const date = dateFilter ? report.createDate.startsWith(dateFilter) : true;
              const author = authorFilter ? report.userName === authorFilter : true;
              return date && author;
            })
          );
        }
        return null;
      } catch (error) {
        console.error(error);
        const errorMessage = '일지를 불러오는데 실패했습니다.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };
    patient();
    loadReportList();
  }, [dateFilter, authorFilter]);

  if (error) {
    return null;
  }

  const path = userStatus ? 'guardian' : 'caregiver';

  return (
    <Wrap>
      <MainTitle>돌봄 대상자 정보</MainTitle>
      <Container>
        <Title>돌봄 대상자</Title>
        <SubTitle>
          {pat.patName} / {pat.patAge} / {pat.patGender === 'F' ? '여' : '남'}
        </SubTitle>
        <SubTitle>비상연락망 : {formatPhoneNumber(pat.phone)}</SubTitle>
        <SubTitle>거주지 : {pat.patAddress}</SubTitle>
        <SubTitle>키 : {pat.patHeight}</SubTitle>
        <SubTitle>몸무게 : {pat.patWeight}</SubTitle>
        <br />
        <Title>건강 상태</Title>

        <SubTitle>{pat.patContent}</SubTitle>
      </Container>
      <br />
      <Board>
        <BoardTitle>
          <ListTitle>진단 일지 목록</ListTitle>
          <Rights>
            <Filters>
              {/* 날짜 필터 */}
              <Fillter value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                <Option value="">날짜 : 전체</Option>
                {uniqueDates.map((date) => (
                  <Option key={date} value={date}>
                    {date}
                  </Option>
                ))}
              </Fillter>
              {/* 작성자 필터 */}
              <Fillter value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)}>
                <Option value="">작성자 : 전체</Option>
                {uniqueAuthors.map((author) => (
                  <Option key={author} value={author}>
                    {author}
                  </Option>
                ))}
              </Fillter>
            </Filters>
            <Buttons>
              <SubmitButton onClick={() => navigate(`/${path}/matchpage`)}>
                <ButtonText>목록으로</ButtonText>
              </SubmitButton>

              {!(userStatus || status === 'N') && (
                <Link to={`/caregiver/reportform/${patNo}`} state={pat.patName}>
                  <SubmitButton>
                    <ButtonText>글쓰기</ButtonText>
                  </SubmitButton>
                </Link>
              )}
            </Buttons>
          </Rights>
        </BoardTitle>

        <BoardItemTitle>
          <div>No</div>
          <div>
            <p>제목</p>
          </div>
          <div>작성자</div>
          <div>작성 일자</div>
        </BoardItemTitle>
        {reportList && reportList.length > 0 ? (
          reportList.map((report, index) => (
            <BoardItem key={report.reportNo} to={`/report/detail/${report.reportNo}`} state={{ report }}>
              <div>{index + 1}</div>
              <div>
                <ReportTitle>{report.reportTitle}</ReportTitle>
              </div>
              <div>{report.userName}</div>
              <div>{report.createDate.slice(0, 10)}</div>
            </BoardItem>
          ))
        ) : (
          <BoardItemTop>
            <div>진단일지가 없습니다.</div>
          </BoardItemTop>
        )}
      </Board>
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: ${({ theme }) => theme.spacing[8]} 0;
  max-width: 950px;
  margin: 0 auto;
`;

const MainTitle = styled.p`
  padding-bottom: ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
`;

const Container = styled(Section)`
  box-shadow: ${({ theme }) => theme.shadows.base};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding-bottom: 10px;
`;

const SubTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-left: 20px;
`;

const Board = styled.div`
  width: 100%;
  > div {
    display: flex;
    justify-content: space-between;
  }
`;

const BoardTitle = styled(BoardTop)`
  border-bottom: 0;
`;

const BoardItemTitle = styled(BoardItemTop)`
  width: 100%;
  height: ${({ theme }) => theme.spacing[10]};
  align-items: center;
  margin-top: 10px;
  border-bottom: 0;
  background-color: #feeee4;
  box-shadow: ${({ theme }) => theme.shadows.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  :nth-of-type(1) {
    width: 300px;
  }
`;
const ListTitle = styled(Left)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap;
`;

const Fillter = styled.select`
  width: 140px;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[3]};
`;

const Option = styled.option``;

const BoardItem = styled(Link)`
  width: 100%;
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 5px 0;
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]}; */
  transition: all 0.2s ease-in-out;

  > div {
    flex: 1;
    :nth-of-type(1) {
      width: 300px;
    }
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;
const ReportTitle = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Rights = styled(Right)`
  justify-content: space-between;
`;

const Filters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
`;
export default ReportMain;
