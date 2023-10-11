import React, { useState, useEffect, memo, ChangeEvent } from 'react';
import MainInput from '../../components/baseComponents/MainInput';
import { useDispatch, useSelector } from 'react-redux';
import { validateEmail } from '../../utils/validate';
import { userLoginSSORequest, userResetLoginError } from '../../redux/actions';
import { Alert } from 'react-bootstrap';

function SSOWindow() {
    const messageSso = useSelector((state: any) => state.user.messageSso); // Замените any на тип вашего состояния Redux
    const displaySso = true;
    const [email, setEmail] = useState<string>('');
    const [SSOToken, setSSOToken] = useState<string>('');
    const dispatch = useDispatch();

    useEffect(() => {
        const { search } = window.location;
        let params = search.slice(1).split('&');
        let paramsArrSplitedVal = params.map((item) => item.split('='));
        let objParams: Record<string, string> =
            Object.fromEntries(paramsArrSplitedVal);
        setSSOToken(objParams.token);
    }, []);

    const loginSso = () => {
        dispatch(userLoginSSORequest({ username: email }));
    };

    const hideAlert = () => {
        dispatch(userResetLoginError());
    };

    useEffect(() => {
        if (SSOToken) {
            window.opener.postMessage({ token: SSOToken }, '/');
            window.close();
        }
    }, [SSOToken]);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    return (
        <div className="sso-modal">
            <div className="sso-container">
                <div className="sso-content">
                    {displaySso ? (
                        <h1 className="font-weight-light login-title">
                            Sign In SSO
                        </h1>
                    ) : (
                        <h1 className="font-weight-light text-left login-title">
                            Sign In SSO
                        </h1>
                    )}
                    {messageSso && typeof messageSso === 'string' && (
                        <Alert variant="danger" onClose={hideAlert} dismissible>
                            {displaySso ? messageSso : messageSso}
                        </Alert>
                    )}
                    <div>
                        <MainInput
                            value={email}
                            onChange={handleEmailChange}
                            required
                            placeholder="Username"
                            validator={validateEmail}
                        />
                        <button
                            type="button"
                            onClick={loginSso}
                            className="btn btn-fullwidth btn-main mt-4"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(SSOWindow);
