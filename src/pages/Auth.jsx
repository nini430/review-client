import { AuthForm } from "../components";

import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { useDispatch } from "react-redux";
import { cleanupErrors } from "../redux/slices/auth";
import { useTranslation } from "react-i18next";

const Auth = ({ isRegister }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <div className="auth">
      {isRegister ? (
        <AuthForm isRegister />
      ) : (
        <Tabs>
          <TabList onClick={() => dispatch(cleanupErrors())}>
            <Tab>{t("sign_in_as_user")}</Tab>
            <Tab>{t("sign_in_as_admin")}</Tab>
          </TabList>
          <TabPanel>
            <AuthForm />
          </TabPanel>
          <TabPanel>
            <AuthForm admin={true} />
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
};

export default Auth;
