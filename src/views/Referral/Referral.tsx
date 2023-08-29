import { useParams, useHistory } from 'react-router-dom';

const Referral = () => {
  const { referral } = useParams<{ referral: string | undefined }>();
  const history = useHistory();
  if (referral) {
    history.push({ pathname: '/auth/register', state: referral });
  } else {
    history.push('/auth/login');
  }
  return <></>;
};

export default Referral;
