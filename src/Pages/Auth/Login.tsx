import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpinnerLoader from "../../Ui/Spinner";
import { useLogin } from "../../Services/Auth/useLogin";
import { useGetUserCredantiels } from "../../Services/Auth/GetUserCredantiles";
import { enqueueSnackbar } from "notistack";
import { useConfirmToken } from "../../Services/Auth/useConfirmToken";

function Login() {
  const navigate = useNavigate();
  const { mutate: log } = useLogin();
  const { mutate: confirmToken } = useConfirmToken();
  const { mutate: getCredantials } = useGetUserCredantiels();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (!token || !username) {
      navigate("/no-autorise", { replace: true });
      return;
    }

    confirmToken(
      { sso_token: token },
      {
        onSuccess: () => {
          /* 2️⃣ Récupérer identifiants */
          getCredantials(
            { username },
            {
              onSuccess: (data) => {
                /* 3️⃣ Login automatique */
                log(
                  {
                    username: data.username,
                    password: data.password,
                  },
                  {
                    onSuccess: () => {
                      enqueueSnackbar("Connexion réussie", {
                        variant: "success",
                      });
                      navigate("/", { replace: true });
                    },
                    onError: () => {
                      navigate("/no-autorise", { replace: true });
                    },
                  }
                );
              },
              onError: () => {
                navigate("/no-autorise", { replace: true });
              },
            }
          );
        },
        onError: () => {
          navigate("/no-autorise", { replace: true });
        },
      }
    );
  }, []);

  /* 🌀 UI invisible */
  return (
    <div className="flex items-center justify-center h-screen">
      <SpinnerLoader />
    </div>
  );
}

export default Login;
