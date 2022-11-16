import {
	Card,
	Grid,
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	Container,
	Link
} from '@mui/material';
import React, { useState } from 'react';
import useAuth from './../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Box, styled, useTheme } from '@mui/system';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import './Register.scss';
import '@mui/material/styles';
import { getValidationErrorMesage } from '../../common/helpers/common';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FlexBox = styled(Box)(() => ({
	display: 'flex',
	alignItems: 'center'
}));

const JustifyBox = styled(FlexBox)(() => ({
	justifyContent: 'center'
}));

const JWTRoot = styled(Box)(() => ({
	background: '#fff',
	height: '100%',
	paddingTop: '30px'
}));

const TitleBox = styled(Box)(() => ({
	width: '100%'
}));

const ContentBox = styled(Box)(() => ({
	width: '100%'
}));

const StyledProgress = styled(CircularProgress)(() => ({
	position: 'absolute',
	top: '6px',
	left: '25px'
}));

const Register = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [userInfo, setUserInfo] = useState({
		email: '',
		username: '',
		firstName: '',
		lastName: '',
		phoneNumber: '',
		password: '',
		confirmPassword: ''
	});

	const [message, setMessage] = useState('');
	const { register } = useAuth();

	const { t } = useTranslation();
	const handleChange = ({ target: { name, value } }) => {
		let temp = { ...userInfo };
		temp[name] = value;
		setUserInfo(temp);
	};

	const { palette } = useTheme();

	const handleFormSubmit = async (event) => {
		setLoading(true);
		try {
			await register(userInfo);
			navigate('/');
		} catch (error) {
			setMessage('Đã có lỗi xảy ra!');
			setLoading(false);
		}
	};

	return (
		<JWTRoot>
			<Container className="container">
				<Grid>
					<Grid item md={12}>
						<TitleBox className="title-box">
							<h1 className="title">{t('pages.titles.register')}</h1>
						</TitleBox>
					</Grid>
					<Grid item md={12}>
						<ContentBox>
							<ValidatorForm onSubmit={handleFormSubmit}>
								<TextValidator
									sx={{ mb: 3, width: '100%' }}
									variant="outlined"
									size="small"
									label={t('pages.common.labels.email')}
									onChange={handleChange}
									type="email"
									name="email"
									value={userInfo.email}
									validators={['required', 'isEmail']}
									errorMessages={[
										getValidationErrorMesage(
											t('pages.common.labels.email'),
											t('pages.common.validations.required')
										),
										getValidationErrorMesage(
											t('pages.common.labels.email'),
											t('pages.common.validations.isEmail')
										)
									]}
								/>
								<TextValidator
									sx={{ mb: 3, width: '100%' }}
									variant="outlined"
									size="small"
									label={t('pages.common.labels.username')}
									onChange={handleChange}
									type="text"
									name="username"
									value={userInfo.username}
									validators={['required']}
									errorMessages={[
										getValidationErrorMesage(
											t('pages.common.labels.username'),
											t('pages.common.validations.required')
										),
										getValidationErrorMesage(
											t('pages.common.labels.username'),
											t('pages.common.validations.isEmail')
										)
									]}
								/>
								<TextValidator
									sx={{ mb: 3, width: '100%' }}
									variant="outlined"
									size="small"
									label={t('pages.common.labels.password')}
									onChange={handleChange}
									type="text"
									name="username"
									value={userInfo.password}
									validators={['required']}
									errorMessages={[
										getValidationErrorMesage(
											t('pages.common.labels.password'),
											t('pages.common.validations.required')
										),
										getValidationErrorMesage(
											t('pages.common.labels.password'),
											t('pages.common.validations.isEmail')
										)
									]}
								/>
								<TextValidator
									sx={{ mb: 3, width: '100%' }}
									variant="outlined"
									size="small"
									label={t('pages.common.labels.confirm_password')}
									onChange={handleChange}
									type="text"
									name="username"
									value={userInfo.confirmPassword}
									validators={['required']}
									errorMessages={[
										getValidationErrorMesage(
											t('pages.common.labels.confirm_password'),
											t('pages.common.validations.required')
										),
										getValidationErrorMesage(
											t('pages.common.labels.confirm_password'),
											t('pages.common.validations.isEmail')
										)
									]}
								/>
								<Box sx={{ width: '100%', display: 'flex' }}>
									<TextValidator
										sx={{ mb: 3, width: '100%' }}
										variant="outlined"
										size="small"
										label={t('pages.common.labels.first_name')}
										onChange={handleChange}
										type="text"
										name="username"
										value={userInfo.firstName}
										validators={['required']}
										errorMessages={[
											getValidationErrorMesage(
												t('pages.common.labels.first_name'),
												t('pages.common.validations.required')
											)
										]}
									/>
									<TextValidator
										sx={{ mb: 3, width: '100%' }}
										variant="outlined"
										size="small"
										label={t('pages.common.labels.last_name')}
										onChange={handleChange}
										type="text"
										name="username"
										value={userInfo.lastName}
										validators={['required']}
										errorMessages={[
											getValidationErrorMesage(
												t('pages.common.labels.last_name'),
												t('pages.common.validations.required')
											)
										]}
									/>
								</Box>
								<FlexBox mb={2} flexWrap="wrap">
									<JustifyBox width="100%">
										<Box position="relative" mr="10px">
											<Button
												variant="outlined"
												color="primary"
												disabled={loading}
												type="submit"
											>
												{t('pages.common.labels.login')}
											</Button>
											{loading && (
												<StyledProgress size={24} className="buttonProgress" />
											)}
										</Box>
										<Box>
											<Button
												variant="outlined"
												color="error"
												disabled={loading}
												type="button"
											>
												<Link
													className="router-link"
													to="/register"
													color="error"
												>
													{t('pages.common.labels.back')}
												</Link>
											</Button>
										</Box>
									</JustifyBox>
								</FlexBox>
							</ValidatorForm>
						</ContentBox>
					</Grid>
				</Grid>
			</Container>
		</JWTRoot>
	);
};

export default Register;
