import RegisterForm from "@/components/registerForm";

const Register = () => {
  return (
    <div className="flex flex-col w-full max-w-sm gap-3 mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-bold">Register</h2>
        <p className="dark:text-white/50 text-sm text-gray-500">
          Please enter your credentials to log in.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
