import { Button, CheckboxProps } from "antd";
import img from "../../assets/images/image.png";

import SpinnerLoader from "../../Ui/Spinner";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import CustomCheckbox from "../../Ui/CustomChekbox";
import { useEffect, useState } from "react";
import { LoginParams, useLogin } from "../../Services/Auth/useLogin";
import { enqueueSnackbar } from "notistack";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorUsername, seterrorUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passType, setPassType] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate: log, isPending } = useLogin();

  function showHidePass() {
    setPassType((prev) => (prev === "password" ? "text" : "password"));
  }

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe");

    if (savedRememberMe === "true") {
      setEmail(savedUsername || "");
      setPassword(savedPassword || "");
      setRememberMe(true);
    }
  }, []);

  const onClick = () => {
    let hasError = false;

    if (!email) {
      seterrorUsername(true);
      enqueueSnackbar("Entrez le username", { variant: "error" });
      hasError = true;
    }

    if (!password) {
      setErrorPassword(true);
      enqueueSnackbar("Entrez le mot de passe", { variant: "error" });
      hasError = true;
    }

    if (hasError) return;

    setErrorPassword(false);
    seterrorUsername(false);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const params: LoginParams = {
        password: password,
        username: email,
      };

      if (rememberMe) {
        localStorage.setItem("savedUsername", email);
        localStorage.setItem("savedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("savedPassword");
        localStorage.setItem("rememberMe", "false");
      }

      log(params, {
        onSuccess: () => {
        },
      });
    }, 2000);
  };

  const onChange: CheckboxProps["onChange"] = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="bg-gray-100 lg:px-[200px] max-lg:p-2">
      <div className="flex items-center justify-center min-h-screen">
        <div className="shadow-2xl p-16 max-lg:p-4 rounded-lg bg-white lg:w-[550px] max-lg:w-full">
          <img src={img} className="mb-4" />

          {/* FORMULAIRE */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onClick();
            }}
          >
            <label className="text-sm font-light text-blue-2a mt-6">
              Username
            </label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorUsername) seterrorUsername(false);
              }}
              type="text"
              className={`${
                errorUsername ? "border-red-600" : ""
              } border-b w-full outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
              placeholder="Username"
            />
            <span className="text-red-600 text-[12px]">
              {errorUsername ? "Entrez le username" : ""}
            </span>

            <div className="flex flex-col gap-y-[5px] mt-4">
              <label className="text-sm font-light text-blue-2a">
                Mot de Passe
              </label>
              <div className="flex items-center justify-between">
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorPassword) setErrorPassword(false);
                  }}
                  type={passType}
                  className={`${
                    errorPassword ? "border-red-600 " : ""
                  } border-b flex-1 w-full outline-none text-sm font-medium pb-1 text-blue-2a placeholder:text-blue-2a/50 placeholder:font-light`}
                  placeholder="Mot de Passe"
                />

                <div
                  className="cursor-pointer text-blue-2a"
                  onClick={showHidePass}
                >
                  {passType === "password" ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
              <span className="text-red-600 text-[12px]">
                {errorPassword ? "Entrez le mot de passe" : ""}
              </span>
            </div>

            <div className="flex justify-between items-center w-full mt-5">
              <div className="flex items-center justify-center cursor-pointer font-bold hover:text-main-color hover:underline text-[10px]">
                <CustomCheckbox
                  onChange={onChange}
                  label="Enregistrer les données"
                  checked={rememberMe}
                  value="Dateo"
                />
              </div>
              <Link
                to="/forget-password"
                className="text-black text-[14px] font-medium"
              >
                <span className="text-[13px] font-bold cursor-pointer hover:text-main-color hover:underline">
                  Mot de Passe Oublié
                </span>
              </Link>
            </div>

            <Button
              className="w-full bg-main-color text-white mt-4 h-[43px] primary-button"
              loading={isPending}
              htmlType="submit"
            >
              Connecter
            </Button>
          </form>

          {loading && <SpinnerLoader />}

          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-600">AUB Crédit</span>
            </div>
            <p className="text-xs text-gray-500">
              Fait par Direction Informatique (DSI)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
