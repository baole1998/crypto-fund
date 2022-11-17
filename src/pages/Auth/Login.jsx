import { Button, Card, Checkbox, CircularProgress, FormControlLabel, Grid } from "@mui/material";
import "@mui/material/styles";
import { Box, styled, useTheme } from "@mui/system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Link, useNavigate } from "react-router-dom";
import { getValidationErrorMesage } from "../../common/helpers/common";
import useAuth from "./../../hooks/useAuth";
import "./Login.scss";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "center",
}));

const ContentBox = styled(Box)(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
}));

const IMG = styled("img")(() => ({
  width: "100%",
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,
    borderRadius: 12,
    margin: "1rem",
  },
}));

const StyledProgress = styled(CircularProgress)(() => ({
  position: "absolute",
  top: "6px",
  left: "25px",
}));

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    agreement: false,
  });
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  const handleChange = ({ target: { name, value } }) => {
    let temp = { ...userInfo };
    temp[name] = value;
    setUserInfo(temp);
  };

  const { palette } = useTheme();
  const textError = palette.error.main;

  const { t } = useTranslation();

  const handleFormSubmit = async (event) => {
    setLoading(true);
    try {
      await login(userInfo.email, userInfo.password);
      navigate("/");
    } catch (e) {
      console.log(e);
      setMessage("Thông tin tài khoản không chính xác");
      setLoading(false);
    }
  };

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item lg={5} md={5} sm={5} xs={12}>
            <JustifyBox p={4} height="100%">
              <IMG src="/static/images/logo/logo-1.png" alt="" />
            </JustifyBox>
          </Grid>
          <Grid item lg={7} md={7} sm={7} xs={12}>
            <ContentBox>
              <ValidatorForm onSubmit={handleFormSubmit}>
                <TextValidator
                  sx={{ mb: 3, width: "100%" }}
                  variant="filled"
                  size="small"
                  label={t("pages.common.labels.username")}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={userInfo.email}
                  validators={[
                    "required",
                    "isEmail"
                  ]}
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
                  sx={{ mb: "3px", width: "100%" }}
                  label={t("pages.common.labels.password")}
                  variant="filled"
                  size="small"
                  onChange={handleChange}
                  name="password"
                  type="password"
                  value={userInfo.password}
                  validators={["required"]}
                  errorMessages={[
                    getValidationErrorMesage(
                      t("pages.common.labels.password"),
                      t("pages.common.validations.required")
                    ),
                  ]}
                />
                <FormControlLabel
                  sx={{ mb: "2px", maxWidth: 288 }}
                  name="agreement"
                  onChange={handleChange}
                  control={
                    <Checkbox
                      size="small"
                      onChange={({ target: { checked } }) =>
                        handleChange({
                          target: {
                            name: "agreement",
                            value: checked,
                          },
                        })
                      }
                      checked={userInfo.agreement}
                    />
                  }
                  label={t("pages.common.labels.remember_password")}
                />
                {message && <div sx={{ color: textError, mb: 1 }}>{message}</div>}
                <FlexBox mb={2} flexWrap="wrap">
                  <Box width="100%" marginBottom="10px">
                    <Link width="100%" className="router-link" to="/register">
                      Đăng ký tài khoản
                    </Link>
                  </Box>
                  <Box position="relative">
                    <Button variant="contained" color="primary" disabled={loading} type="submit">
                      {t("pages.common.labels.login")}
                    </Button>
                    {loading && <StyledProgress size={24} className="buttonProgress" />}
                  </Box>
                </FlexBox>
              </ValidatorForm>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};

export default Login;
