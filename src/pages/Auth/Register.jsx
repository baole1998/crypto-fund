import { Button, CircularProgress, Container, Grid } from "@mui/material"
import "@mui/material/styles"
import { Box, styled, useTheme } from "@mui/system"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator"
import { Link, useNavigate } from "react-router-dom"
import Datepicker from "src/components/Datepicker"
import { getValidationErrorMesage } from "../../common/helpers/common"
import "../../i18n/config"
import useAuth from "./../../hooks/useAuth"
import "./Register.scss"

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}))

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "center",
}))

const JWTRoot = styled(Box)(() => ({
  background: "#1A2038",
  height: "100%",
}))

const TitleBox = styled(Box)(() => ({
  width: "100%",
}))

const ContentBox = styled(Box)(() => ({
  width: "100%",
}))

const StyledProgress = styled(CircularProgress)(() => ({
  position: "absolute",
  top: "6px",
  left: "25px",
}))

const ContainerBox = styled(Container)(() => ({
  background: "#fff",
  paddingTop: "30px",
  height: "100%",
}))

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  })

  const [message, setMessage] = useState("")
  const { register } = useAuth()

  const { t } = useTranslation()
  const handleChange = ({ target: { name, value } }) => {
    let temp = { ...userInfo }
    temp[name] = value
    setUserInfo(temp)
  }

  const { palette } = useTheme()

  const handleFormSubmit = async (event) => {
    setLoading(true)
    try {
      await register(userInfo)
      navigate("/")
    } catch (error) {
      setMessage("Đã có lỗi xảy ra!")
      setLoading(false)
    }
  }

  return (
    <JWTRoot>
      <ContainerBox className="container">
        <Grid>
          <Grid item md={12} marginBottom="20px">
            <TitleBox className="title-box">
              <h1 className="title">{t("pages.titles.register")}</h1>
            </TitleBox>
          </Grid>
          <Grid item md={12}>
            <ContentBox>
              <ValidatorForm onSubmit={handleFormSubmit}>
                <TextValidator
                  sx={{ mb: 3, width: "100%" }}
                  variant="filled"
                  size="small"
                  label={t("pages.common.labels.email")}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={userInfo.email}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    getValidationErrorMesage(
                      t("pages.common.labels.email"),
                      t("pages.common.validations.required")
                    ),
                    getValidationErrorMesage(
                      t("pages.common.labels.email"),
                      t("pages.common.validations.isEmail")
                    ),
                  ]}
                />
                <TextValidator
                  sx={{ mb: 3, width: "100%" }}
                  variant="filled"
                  size="small"
                  label={t("pages.common.labels.username")}
                  onChange={handleChange}
                  type="text"
                  name="username"
                  value={userInfo.username}
                  validators={["required"]}
                  errorMessages={[
                    getValidationErrorMesage(
                      t("pages.common.labels.username"),
                      t("pages.common.validations.required")
                    ),
                    getValidationErrorMesage(
                      t("pages.common.labels.username"),
                      t("pages.common.validations.isEmail")
                    ),
                  ]}
                />
                <TextValidator
                  sx={{ mb: 3, width: "100%" }}
                  variant="filled"
                  size="small"
                  label={t("pages.common.labels.password")}
                  onChange={handleChange}
                  type="password"
                  name="password"
                  value={userInfo.password}
                  validators={["required"]}
                  errorMessages={[
                    getValidationErrorMesage(
                      t("pages.common.labels.password"),
                      t("pages.common.validations.required")
                    ),
                    getValidationErrorMesage(
                      t("pages.common.labels.password"),
                      t("pages.common.validations.isEmail")
                    ),
                  ]}
                />
                <TextValidator
                  sx={{ mb: 3, width: "100%" }}
                  variant="filled"
                  size="small"
                  label={t("pages.common.labels.confirm_password")}
                  onChange={handleChange}
                  type="password"
                  name="confirmPassword"
                  value={userInfo.confirmPassword}
                  validators={["required"]}
                  errorMessages={[
                    getValidationErrorMesage(
                      t("pages.common.labels.confirm_password"),
                      t("pages.common.validations.required")
                    ),
                    getValidationErrorMesage(
                      t("pages.common.labels.confirm_password"),
                      t("pages.common.validations.isEmail")
                    ),
                  ]}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    "&>div": {
                      width: "50%",
                      "&:first-of-type": {
                        marginRight: "10px",
                      },
                    },
                  }}>
                  <TextValidator
                    sx={{ mb: 3, width: "100%" }}
                    variant="filled"
                    size="small"
                    label={t("pages.common.labels.first_name")}
                    onChange={handleChange}
                    type="text"
                    name="firstName"
                    value={userInfo.firstName}
                    validators={["required"]}
                    errorMessages={[
                      getValidationErrorMesage(
                        t("pages.common.labels.first_name"),
                        t("pages.common.validations.required")
                      ),
                    ]}
                  />
                  <TextValidator
                    sx={{ mb: 3, width: "100%" }}
                    variant="filled"
                    size="small"
                    label={t("pages.common.labels.last_name")}
                    onChange={handleChange}
                    type="text"
                    name="lastName"
                    value={userInfo.lastName}
                    validators={["required"]}
                    errorMessages={[
                      getValidationErrorMesage(
                        t("pages.common.labels.last_name"),
                        t("pages.common.validations.required")
                      ),
                    ]}
                  />
                </Box>
                <TextValidator
                  sx={{ mb: 3, width: "100%" }}
                  variant="filled"
                  size="small"
                  label={t("pages.common.labels.phone_number")}
                  onChange={handleChange}
                  type="text"
                  name="phoneNumber"
                  value={userInfo.phoneNumber}
                  validators={["required"]}
                  errorMessages={[
                    getValidationErrorMesage(
                      t("pages.common.labels.phone_number"),
                      t("pages.common.validations.required")
                    ),
                  ]}
                />
                <Datepicker
                  label={t("pages.common.labels.date_of_birth")}
                  onChange={handleChange}
                  value={userInfo.dateOfBirth}
                  sx={{ mb: 3, width: "100%" }}
                  name="dateOfBirth"
                  validators={["required"]}
                  defaultValue={new Date()}
                  placeholder=""
                  errorMessages={[
                    getValidationErrorMesage(
                      t("pages.common.labels.date_of_birth"),
                      t("pages.common.validations.required")
                    ),
                  ]}
                />
                <FlexBox mb={2} flexWrap="wrap">
                  <JustifyBox width="100%">
                    <Box position="relative" mr="10px">
                      <Button variant="outlined" color="primary" disabled={loading} type="submit">
                        {t("pages.common.labels.login")}
                      </Button>
                      {loading && <StyledProgress size={24} className="buttonProgress" />}
                    </Box>
                    <Box>
                      <Button variant="outlined" color="error" disabled={loading} type="button">
                        <Link className="router-link" to="/login">
                          {t("pages.common.labels.back")}
                        </Link>
                      </Button>
                    </Box>
                  </JustifyBox>
                </FlexBox>
              </ValidatorForm>
            </ContentBox>
          </Grid>
        </Grid>
      </ContainerBox>
    </JWTRoot>
  )
}

export default Register
