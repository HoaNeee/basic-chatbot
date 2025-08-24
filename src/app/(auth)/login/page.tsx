import LoginForm from "@/components/loginForm";

const Login = () => {
  return (
    <div className="flex flex-col w-full max-w-sm gap-3 mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-bold">Login</h2>
        <p className="dark:text-white/50 text-sm text-gray-500">
          Please enter your credentials to log in.
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
