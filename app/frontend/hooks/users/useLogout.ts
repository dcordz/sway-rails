// import { router } from "@inertiajs/react";
import { useAxios_NOT_Authenticated_POST } from "../useAxios";
import { handleError } from "../../sway_utils";
import { useCallback } from "react";

export const useLogout = () => {
    const { post: logout } = useAxios_NOT_Authenticated_POST<Record<string, any>>("/logout");

    return useCallback(() => {
        logout({})
            .then(() => {
                localStorage.clear();
                sessionStorage.clear();
                // router.visit("/");
            })
            .catch(handleError);
    }, [logout]);
};
export const useLogoutNoRedirect = () => {
    const { post: logout } = useAxios_NOT_Authenticated_POST<Record<string, any>>("/logout");

    return useCallback(() => {
        logout({})
            .then(() => {
                localStorage.clear();
                sessionStorage.clear();
            })
            .catch(handleError);
    }, [logout]);
};
