import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      toast.success(
        "Account sucessfully created! Please verify the new account from the user's email address."
      );
    },
    // onError: (error) => {
    //   toast.error(error?.message);
    // },
  });
  return { signup, isLoading };
}

export default useSignup;
