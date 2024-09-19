import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading';

function AuthWrapper(WrappedComponent: any) {
    const Wrapper = (props: any) => {
        const [loogedIn, setLoggedIn] = useState(false);
        const [loading, setLoading] = useState(true);
        const [accessDenied, setAccessDenied] = useState(false);
        const navigate = useNavigate();

        useEffect(() => {
            const verifyAuthToken = async () => {
                try {
                    const res = await fetch("http://localhost:8000/api/v1/auth/verify", {
                        method: 'POST',
                        credentials: 'include',
                    });
                    if (res.status === 200) {
                        setLoading(false);
                        setLoggedIn(true);
                    } else if (res.status === 403 || res.status === 401) {
                        setLoading(false);
                        setAccessDenied(true);
                    } else {
                        setLoading(false);
                        setAccessDenied(true);
                    }
                } catch (error) {
                    setLoading(false);
                    setAccessDenied(true);
                }
            };
            verifyAuthToken();
        }, []);

        if (loading) {
            return <Loading />;
        } else if (accessDenied) {
            setLoading(true);
            setTimeout(() => {
                navigate('/sign-in');
            }, 1000);
        }
        return <WrappedComponent loggedIn={loogedIn} {...props} />;
    };
    return Wrapper;
}
export default AuthWrapper;