import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  @media (max-width: 600px) {
    position: relative;
    top: 30%;
    font-size: 150px;
  }
`;

export const LoginWrapper = styled.div`
  width: 70%;

  @media (max-width: 600px) {
    width: 90%;
    margin-top: 50vh;
  }
`;
