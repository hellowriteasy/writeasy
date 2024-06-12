import { useRouter } from 'next/router';

const Failure = () => {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <div>
      <h1>Payment Failed</h1>
      <p>Session ID: {session_id}</p>
      {/* Add more failure page content */}
    </div>
  );
};

export default Failure;
