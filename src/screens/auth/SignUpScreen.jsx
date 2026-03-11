import React from 'react';
import LoginScreen from './LoginScreen';

const SignUpScreen = (props) => {
    return <LoginScreen {...props} route={{ ...props.route, params: { tab: 'signup' } }} />;
};

export default SignUpScreen;
